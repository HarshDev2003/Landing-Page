const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = 5000;
const mysql = require("mysql");
// Middleware
const db = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12757220",       // Replace with your DB username
    password: "tzndJauJIt",       // Replace with your DB password
    database: "sql12757220", // Replace with your database name
  });
  
  // Connect to the database
  db.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }
    console.log("Connected to MySQL database.");
  });
  
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
// Session Configuration
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Fake Users Database
const users = {
  user1: { username: 'user1', password: 'password123' },
  user2: { username: 'user2', password: 'mypassword' },
};

// Routes
app.get('/ejs', (req, res) => {
  res.render('index');
});

app.get("/database", (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        return res.status(500).send("Error fetching data.");
      }
  
      // Render the EJS template with the data
      res.render("index", { users: results });
    });
  });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Authentication
  if (users[username] && users[username].password === password) {
    req.session.user = username; // Save user in session
    return res.redirect('/dashboard');
  }

  res.render('login', { error: 'Invalid username or password!' });
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.send(`<h1>Welcome, ${req.session.user}!</h1><a href="/logout">Logout</a>`);
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
