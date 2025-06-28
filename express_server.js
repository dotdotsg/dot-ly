const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const db = require('./data/db');
const { getUserByEmail, getUrlsForUser, generateShortCode } = require('./helper.js');
const QRCode = require('qrcode');


const PORT = 8000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["secretKey1", "secretKey2"],
}));

// define routes here (register, login, create, show, delete short urls)
//must add this middleware for the request.body to contain form value
app.use(express.json()); // <-- important for JSON request body
app.use(express.urlencoded({ extended: true })); // <-- for form data
app.use(express.static('public'));


app.get("/", (req, res) => {
  res.redirect('/urls');
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/register', (req, res) => res.render('register', { error: null }));
app.get('/login', (req, res) => res.render('login', { error: null }));

// register a user
app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(403).send('Invalid Credentials');

  const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userExists.rows.length) return res.status(403).send('User already exists');

  const id = generateShortCode();//generateRandomString();
  const hashedPass = bcrypt.hashSync(password, 10);
  await db.query('INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)', [id, name, email, hashedPass]);

  req.session.userID = id;
  res.redirect('/urls');
});


// user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(403).render('login', { error: 'Invalid credentials' });

  req.session.userID = user.id;
  res.redirect('/urls');
});
// urls get
app.get('/urls', async (req, res) => {
  const userId = req.session.userID;
  if (!userId) return res.redirect('/login');

  const result = await db.query('SELECT * FROM urls WHERE user_id = $1', [userId]);
  // res.render('urls_index', { urls: result.rows });
  res.render('urls_index', {
    urls: result.rows,
    host: req.headers.host
  });

});
app.get('/urls/new', (req, res) => {
  if (!req.session.userID) return res.redirect('/login');
  res.render('urls_new');
});

//  create new url .
app.post('/urls', async (req, res) => {
  const userId = req.session.userID;
  if (!userId) return res.redirect('/login');

  const { longUrl } = req.body;
  const shortCode = generateShortCode(); // use nanoid or your own generator

  await db.query(
    'INSERT INTO urls (id, short_code, long_url, user_id) VALUES ($1, $2, $3, $4)',
    [shortCode, shortCode, longUrl, userId]
  );

  res.redirect('/urls');
});
// Handle redirect
app.get('/u/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  const result = await db.query('SELECT long_url FROM urls WHERE short_code = $1', [shortCode]);
  const urlEntry = result.rows[0];

  if (!urlEntry) {
    return res.status(404).send('Short URL not found');
  }

  await db.query('UPDATE urls SET visit_count = visit_count + 1 WHERE short_code = $1', [shortCode]);

  res.redirect(urlEntry.long_url);
});

// show urls
app.get('/urls/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const result = await db.query('SELECT * FROM urls WHERE short_code = $1', [shortCode]);
  const urlEntry = result.rows[0];

  if (!urlEntry) return res.status(404).send('Short URL not found');

  const shortUrl = `${req.headers.host}/u/${shortCode}`;
  const qrCodeDataURL = await QRCode.toDataURL(`http://${shortUrl}`);

  res.render('urls_show', { url: urlEntry, qrCode: qrCodeDataURL, shortUrl });
});
// delete url
app.post('/urls/:shortCode/delete', async (req, res) => {
  const { shortCode } = req.params;
  const userId = req.session.userID;

  // Optional: ensure user owns the URL
  await db.query('DELETE FROM urls WHERE short_code = $1 AND user_id = $2', [shortCode, userId]);

  res.redirect('/urls');
});
// Editing a url
// Show edit form
app.get('/urls/:shortCode/edit', async (req, res) => {
  const { shortCode } = req.params;
  const userId = req.session.userID;

  const result = await db.query('SELECT * FROM urls WHERE short_code = $1 AND user_id = $2', [shortCode, userId]);
  const url = result.rows[0];
  if (!url) return res.status(404).send('URL not found');

  res.render('urls_edit', { url });
});

// Handle edit submission
app.post('/urls/:shortCode/edit', async (req, res) => {
  const { shortCode } = req.params;
  const { longUrl } = req.body;
  const userId = req.session.userID;

  await db.query('UPDATE urls SET long_url = $1 WHERE short_code = $2 AND user_id = $3', [longUrl, shortCode, userId]);
  res.redirect('/urls');
});
// logout
app.post('/logout', (req, res) => {
  req.session = null; 
  res.redirect('/login');
});





app.listen(8000, () => console.log('Server running on http://localhost:8000'));
