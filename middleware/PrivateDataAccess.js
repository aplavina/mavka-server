const User = require('./../data-access/User.js');

module.exports = async function (req, res, next) {
  const reqFrom = await User.readUserById(req.user_id.id);
  if (req.params.username != reqFrom.rows[0].username) {
    return res.status(400).json('Access denied');
  }
  next();
};
