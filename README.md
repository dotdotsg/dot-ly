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
