const User = require('./../data-access/User.js');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

class UserController {
  async getUser(req, res) {
    try {
      User.readUser(req.params.username).then((query_res) => {
        if (query_res.rows.length == 0) {
          res
            .status(400)
            .json(`User with username ${req.params.username} doesen\'t exist`);
        } else {
          res.status(200).json({
            email: query_res.rows[0].email,
            username: query_res.rows[0].username,
            first_name: query_res.rows[0].first_name,
            last_name: query_res.rows[0].last_name,
            wall_id: query_res.rows[0].wall_id,
            avatar_url: query_res.rows[0].avatar_url,
          });
        }
      });
    } catch (exc) {
      res.status(500).json(exc);
    }
  }

  async updateUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Incorrect values error', errors });
    }

    const username = req.params.username;

    const new_email = req.body.email;
    const new_username = req.body.username;
    const new_pass = bcrypt.hashSync(req.body.pass, 7);
    const new_first_name = req.body.first_name;
    const new_last_name = req.body.last_name;
    const new_avatar =
      req.body.avatar_url == null ? 'NULL' : req.body.avatar_url;

    try {
      const queryRes = await User.updateUser(
        username,
        new_email,
        new_username,
        new_pass,
        new_first_name,
        new_last_name,
        new_avatar
      );
      if (queryRes.rowCount == 0) {
        res.status(400).json(`user with username ${username} doesn\'t exist`);
        return;
      }
      res.status(200).json('User updated successfully');
    } catch (exc) {
      if (exc.constraint == 'users_email_key') {
        res.status(500).json('this email is already used');
      } else if (exc.constraint == 'users_username_key') {
        res.status(500).json('this username is already used');
      } else {
        console.log(exc);
        res.status(500).json(exc);
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
