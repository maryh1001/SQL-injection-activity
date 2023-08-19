//const express = require('express');
//const sqlite3 = require('sqlite3').verbose();
//const bodyParser = require('body-parser');

//const app = express();
//const port = 3000;

//app.use(bodyParser.urlencoded({ extended: true }));

const http = require('http'),
path = require('path'),
express = require('express'),
bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



// Create a mock database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run('CREATE TABLE user (username TEXT, password TEXT)');
  db.run("INSERT INTO user VALUES ('admin', 'password123')");
});

// Route for serving the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route for handling login form submission
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = `SELECT title FROM user WHERE username = '${username}' AND password = '${password}';`;
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('SQL query:', query);

    db.get(query, (err, row) => {
      if (err) {
        console.log('ERROR', err);
        res.redirect('/index.html#error');
      } else if (!row) {
        res.redirect('/index.html#unauthorized');
      } else {
        res.send(`Hello <b>${row.title}!</b><br /> 
          This file contains all your secret data: <br /><br /> 
          SECRETS <br /><br /> MORE SECRETS <br /><br /> 
          <a href="/index.html">Go back to login</a>`);
      }
    });
  });

// Close the database connection
db.close();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
