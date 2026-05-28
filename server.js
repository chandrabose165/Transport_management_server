const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   REGISTER API
========================= */

app.post('/register', (req, res) => {

  const newUser = req.body;

  fs.readFile(
    'userdata.json',
    'utf8',
    (err, data) => {

      let users = [];

      if (!err && data) {
        users = JSON.parse(data);
      }

      // CHECK EMAIL EXISTS
      const userExists = users.find(
        (user) => user.email === newUser.email
      );

      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      // ADD USER
      users.push(newUser);

      // SAVE FILE
      fs.writeFile(
        'userdata.json',
        JSON.stringify(users, null, 2),
        (err) => {

          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Error saving user'
            });
          }

          res.json({
            success: true,
            message: 'Registration Successful'
          });
        }
      );
    }
  );
});

/* =========================
   LOGIN API
========================= */

app.post('/login', (req, res) => {

  const { email, password } = req.body;

  fs.readFile(
    'userdata.json',
    'utf8',
    (err, data) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error reading users'
        });
      }

      const users = JSON.parse(data);

      const foundUser = users.find(
        (user) =>
          user.email === email &&
          user.password === password
      );

      if (foundUser) {

        res.json({
          success: true,
          message: 'Login Successful',
          user: foundUser
        });

      } else {

        res.status(401).json({
          success: false,
          message: 'Invalid Email or Password'
        });
      }
    }
  );
});

/* =========================
   SERVER PORT
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
