# dot-ly
A Full Stack Web Application that allows users to shorten long URLs. Built with Node, Express, EJS, cookie-session, and bcrypt.



## API Routes 

| Method | Route              | Purpose                     |
| ------ | ------------------ | --------------------------- |
| GET    | `/register`        | Show registration form      |
| POST   | `/register`        | Register new user           |
| GET    | `/login`           | Show login form             |
| POST   | `/login`           | Authenticate user           |
| POST   | `/logout`          | Clear session               |
| GET    | `/urls`            | Show user's shortened URLs  |
| GET    | `/urls/new`        | New URL form                |
| POST   | `/urls`            | Save a new short URL        |
| GET    | `/u/:id`           | Redirect to long URL        |
| GET    | `/urls/:id`        | Show details of a short URL |
| POST   | `/urls/:id/delete` | Delete URL (only owner)     |
| POST   | `/urls/:id/update` | Update long URL             |


## For your postgres DB Setup on local  :
Create two tables users and urls:

```
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```


```
CREATE TABLE urls (
  id VARCHAR(50) PRIMARY KEY,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  visit_count INTEGER DEFAULT 0
);
```

The details for these is given in [Schema : create-schema.sql](data/create-schema.sql)