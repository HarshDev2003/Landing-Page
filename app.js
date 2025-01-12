const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware
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
