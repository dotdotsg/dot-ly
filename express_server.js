const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const db = require('./data/db');
const {generateShortCode} = require('./helper.js');

const PORT = 8000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["secretKey1", "secretKey2"],
}));

const urlDatabase = {}; // your short:long URLs
const users = {};       // your user db

// define routes here (register, login, create, show, delete short urls)
//must add this middleware for the request.body to contain form value
app.use(express.json()); // <-- important for JSON request body
app.use(express.urlencoded({ extended: true })); // <-- for form data
app.use(cookieSession({
  name: 'session',
  keys: ['userID'],
}));


app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

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
    return res.status(403).send('Invalid credentials');

  req.session.userID = user.id;
  res.redirect('/urls');
});

