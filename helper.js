const db = require('./data/db');

async function getUserByEmail(email) {
  const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
}

async function getUrlsForUser(userId) {
  const res = await db.query('SELECT * FROM urls WHERE user_id = $1', [userId]);
  return res.rows;
}

function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

module.exports = {
  getUserByEmail,
  getUrlsForUser,
  generateShortCode
};
