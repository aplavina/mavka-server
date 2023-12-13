const { validationResult } = require('express-validator');
const AuthService = require('./../services/AuthService');

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Registration error', errors });
      }
      await AuthService.registration({
        email: req.body.email,
        username: req.body.username,
        pass: req.body.pass,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
      });
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
      const user = {
        username: req.body.username,
        pass: req.body.pass,
      };
      const token = await AuthService.login(user);
      return res.json({ token });
    } catch (exc) {
      console.log(exc);
      res.status(400).json(exc);
    }
  }
}

module.exports = new AuthController();
