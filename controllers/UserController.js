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
      if (exc.message == 'server error') {
        return res.status(500).json({ message: 'server error' });
      } else {
        return res.status(400).json({ message: exc.message });
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
      if (exc.message == 'server error') {
        return res.status(500).json({ message: 'server error' });
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
      res.status(200).json({ message: 'user updated successfully' });
    } catch (exc) {
      if (exc.message.startsWith('user does not exist')) {
        return res.status(400).json({
          message: `user with username ${req.params.username} does not exist`,
        });
      } else if (exc.message == 'server error') {
        return res.status(500).json({ message: 'server error' });
      } else {
        return res.status(409).json({ message: exc.message });
      }
    }
  }

  async deleteuser(req, res) {
    const username = req.params.username;
    try {
      const queryRes = await User.deleteUser(username);
      if (queryRes.rowCount != 1) {
        res.status(400).json('User not found');
        return;
      }
      res.status(200).json('User deleted');
    } catch (exc) {
      console.log(exc);
      res.status(500).json(exc);
    }
  }
}

module.exports = new UserController();
