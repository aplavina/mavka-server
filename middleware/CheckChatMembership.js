const Chat = require('./../data-access/Chat');

module.exports = async function (req, res, next) {
  try {
    const isMember = await Chat.checkIfChatMemeberByUserId(
      req.user_id,
      req.params.room_id
    );
    if (!isMember) {
      console.log('not member');
      return res
        .status(403)
        .json({ message: 'Access denied. Not room member.' });
    } else {
      next();
    }
  } catch (exc) {
    console.log(exc);
    return res.status(500).json({ message: 'Error' });
  }
};
