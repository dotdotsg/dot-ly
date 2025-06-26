const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");

const PORT = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["secretKey1", "secretKey2"],
}));

const urlDatabase = {}; // your short:long URLs
const users = {};       // your user db

// define routes here (register, login, create, show, delete short urls)

// register a user
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);

  const result = await db.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [email, hashed]
  );

  req.session.user_id = result.rows[0].id;
  res.redirect('/urls');
});