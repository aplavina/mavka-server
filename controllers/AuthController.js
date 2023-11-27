const { validationResult } = require('express-validator');
const User = require('./../data-access/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('./../config.js');

const generateAccessToken = (id) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Registration error', errors });
      }
      const hashPass = bcrypt.hashSync(req.body.pass, 7);
      await User.addUser(
        req.body.email,
        req.body.username,
        hashPass,
        req.body.first_name,
        req.body.last_name
      );
      res.status(200).json('User registered');
    } catch (exc) {
      if (exc.constraint == 'users_email_key') {
        res.status(400).json('this email is already used');
      } else if (exc.constraint == 'users_username_key') {
        res.status(400).json('this username is already used');
      } else {
        console.log(exc);
        res.status(500).json(exc);
      }
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Registration error', errors });
      }
      const { username, pass } = req.body;
      const userQueryRes = await User.readUser(username);
      if (userQueryRes.rowCount == 0) {
        res.status(400).json(`User ${username} not found`);
      }
      const passIsValid = bcrypt.compareSync(pass, userQueryRes.rows[0].pass);
      if (!passIsValid) {
        return res.status(400).json({ message: `Incorrect password` });
      }
      const token = generateAccessToken(userQueryRes.rows[0].user_id);
      return res.json({ token });
    } catch (exc) {
      console.log(exc);
      res.status(400).json('Login error');
    }
  }
}

module.exports = new AuthController();
