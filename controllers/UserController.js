const User = require('./../data-access/User.js');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const UserService = require('./../services/UserService.js');

class UserController {
  async getUser(req, res) {
    try {
      const serviceRes = await UserService.getUser(req.params.username);
      return res.status(200).json(serviceRes);
    } catch (exc) {
      console.log(exc);
      if (exc.message == 'Server error') {
        return res.status(500).json({ message: 'Server error' });
      } else {
        return res.status(404).json({ message: exc.message });
      }
    }
  }

  async getUserPrivateInfo(req, res) {
    try {
      const serviceRes = await UserService.getUserPrivateInfo(
        req.params.username
      );
      return res.status(200).json(serviceRes);
    } catch (exc) {
      console.log(exc);
      if (exc.message == 'Server error') {
        return res.status(500).json({ message: 'Server error' });
      } else {
        return res.status(400).json({ message: exc.message });
      }
    }
  }

  async updateUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Incorrect values error', errors: errors.errors });
    }

    const newData = {
      username: req.params.username,
      new_email: req.body.email,
      new_pass: bcrypt.hashSync(req.body.pass, 7),
      new_first_name: req.body.first_name,
      new_last_name: req.body.last_name,
      new_avatar: req.body.avatar_url,
    };

    try {
      await UserService.updateUser(newData);
      res.status(200).json({ message: 'User updated successfully' });
    } catch (exc) {
      if (exc.message.startsWith('User does not exist')) {
        return res.status(400).json({
          message: `User with username ${req.params.username} does not exist`,
        });
      } else if (exc.message == 'Server error') {
        return res.status(500).json({ message: 'Server error' });
      } else {
        return res.status(409).json({ message: exc.message });
      }
    }
  }

  async deleteuser(req, res) {
    const username = req.params.username;
    try {
      await UserService.deleteUser(username);
      res.status(200).json({ message: 'User deleted' });
    } catch (exc) {
      if (exc.message == 'User not foudn') {
        res.status(400).json({ message: 'User not found' });
        return;
      } else {
        res.status(500).json({ message: exc.message });
      }
    }
  }
}

module.exports = new UserController();
