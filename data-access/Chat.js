const pool = require('./Pool.js');

const User = require('./User.js');

class Chat {
  async checkIfChatMemeber(username, room_id) {
    const query = `SELECT COUNT(*) FROM chat_memberships
                       JOIN users USING(user_id)
                       WHERE room_id = ${room_id} AND username = ${username}`;
    const queryRes = await pool.query(query);
    if (queryRes.rows[0].count != 0) {
      return true;
    }
    return false;
  }

  async checkIfChatMemeberByUserId(user_id, room_id) {
    const query = `SELECT COUNT(*) FROM chat_memberships
                  WHERE room_id = ${room_id} AND user_id = ${user_id}`;
    const queryRes = await pool.query(query);
    if (queryRes.rows[0].count != 0) {
      return true;
    }
    return false;
  }

  async addToChat(username, room_id) {
    const userId = await User.readUser(username).rows[0].user_id;
    const query = `INSERT INTO chat_memberships(room_id, user_id)
                   VALUES(${room_id}, ${userId})`;

    const queryRes = await pool.query(query);
    return queryRes;
  }

  async createRoom(userId, room_name) {
    const createChatQuery = `INSERT INTO chat_rooms(chat_name) VALUES(\'${room_name}\') RETURNING room_id`;

    let res;

    const client = await pool.connect();
    await client.query('BEGIN');
    try {
      const createChatRes = await client.query(createChatQuery);
      let chatId = createChatRes.rows[0].room_id;
      const addOwnerToChatQuery = `INSERT INTO chat_memberships(room_id, user_id, is_owner)
                                   VALUES (${chatId}, ${userId}, true)`;
      await client.query(addOwnerToChatQuery);
      await client.query('COMMIT');
      res = createChatRes;
    } catch (exc) {
      await client.query('ROLLBACK');
      throw exc;
    } finally {
      client.release();
    }
    return res;
  }

  async addMessageByUser(user_id, message_text, room_id) {
    const query = `INSERT INTO messages(user_id, message_text, room_id)
                   VALUES(${user_id}, \'${message_text}\', ${room_id}) RETURNING created_time`;
    return await pool.query(query);
  }

  async getChatMessagesByUsers(room_id) {
    const query = `SELECT username, first_name, last_name, message_text, avatar_url, created_time
                   FROM messages
                   JOIN users USING(user_id)
                   WHERE messages.user_id IS NOT NULL AND room_id = ${room_id}`;
    const queryRes = await pool.query(query);
    return queryRes;
  }
  async addPersonalMsg(user_id, another_user, text) {
    const another_user_info = await User.readUser(another_user);
    const another_user_id = another_user_info.rows[0].user_id;
    const query = `INSERT INTO personal_messages 
                   VALUES(${user_id}, ${another_user_id}, \'${text}\')`;
    await pool.query(query);
    return { another_user_id: another_user_id, msg_text: text };
  }
}

module.exports = new Chat();
