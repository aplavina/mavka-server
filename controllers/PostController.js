const Post = require('./../data-access/Post.js');
const Wall = require('./../data-access/Wall.js');
const User = require('./../data-access/User.js');
const { validationResult } = require('express-validator');

class PostController {
  // need to check if a user has permission to add post as group!
  // create middleware
  async addPost(req, res) {
    try {
      if (req.body.username == null && req.body.group_id) {
        return res.status(400).json({ message: 'need user_id or group_id' });
      }
      const readUserRes = await User.readUser(req.body.username);
      const user_id =
        readUserRes.rows.length != 0 ? readUserRes.rows[0].user_id : null;
      if (
        !Wall.checkAddPostPermission(
          user_id,
          req.body.group_id,
          req.body.wall_id
        )
      ) {
        return res.status(400).json({ message: 'permission denied' });
      } else {
        await Post.addPost(
          req.body.wall_id,
          user_id,
          req.body.group_id,
          req.body.post_text,
          req.body.reposted_post_id
        );
        return res.status(200).json({ message: 'success' });
      }
    } catch (exc) {
      console.log(exc);
      return res.status(500).json(exc);
    }
  }
}

module.exports = new PostController();
