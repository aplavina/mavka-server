const Chat = require('./../data-access/Chat');
const User = require('./../data-access/User');

class ChatService {
  async getRoomMessages(roomId, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const query_res = await Chat.getChatMessagesByUsers(
      roomId,
      offset,
      pageSize
    );
    return query_res.rows;
  }
}

module.exports = new ChatService();
