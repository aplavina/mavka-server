const pool = require('./Pool.js');

class User {
  async readUser(username) {
    const query = `SELECT user_id, username, email, pass, first_name, last_name, users.wall_id, avatar_url
              FROM users
              WHERE username = \'${username}\'`;
    return await pool.query(query);
  }

  async readUserById(id) {
    const query = `SELECT user_id, username, email, pass, first_name, last_name, users.wall_id, avatar_url
              FROM users
              WHERE user_id = \'${id}\'`;
    return await pool.query(query);
  }

  async addUser(email, username, pass, first_name, last_name) {
    const client = await pool.connect();
    let res;
    await client.query('BEGIN');

    try {
      let wall_id;
      let user_id;
      const createWallQuery = `INSERT INTO walls DEFAULT VALUES RETURNING wall_id`;
      const createWallRes = await client.query(createWallQuery);
      wall_id = createWallRes.rows[0].wall_id;
      const createUserQuery = `INSERT INTO users(email, username, pass, first_name, last_name, wall_id)
                               VALUES(\'${email}\', \'${username}\', \'${pass}\', \'${first_name}\', \'${last_name}\', ${wall_id}) RETURNING user_id`;
      const createUserRes = await client.query(createUserQuery);
      user_id = createUserRes.rows[0].user_id;
      const updateWallQuery = `UPDATE walls
                               SET wall_user_id = ${user_id} WHERE wall_id = ${wall_id}`;
      const updateWallRes = await client.query(updateWallQuery);
      await client.query('COMMIT');
      res = createUserRes;
    } catch (exc) {
      await client.query('ROLLBACK');
      throw exc;
    } finally {
      client.release();
    }
    return res.rows[0];
  }

  async updateUser(
    username,
    new_email,
    new_pass,
    new_first_name,
    new_last_name,
    new_avatar
  ) {
    let updateUserQuery;
    if (new_avatar == null) {
      updateUserQuery = `UPDATE users
                             SET email = \'${new_email}\', pass = \'${new_pass}\',
                                 first_name = \'${new_first_name}\', last_name = \'${new_last_name}\', avatar_url = NULL
                             WHERE username = \'${username}\'`;
    } else {
      updateUserQuery = `UPDATE users
                             SET email = \'${new_email}\', pass = \'${new_pass}\',
                                 first_name = \'${new_first_name}\', last_name = \'${new_last_name}\', avatar_url = \'${new_avatar}\'
                             WHERE username = \'${username}\'`;
    }
    return pool.query(updateUserQuery);
  }

  async deleteUser(username) {
    const deleteUserQuery = `DELETE FROM users WHERE username = \'${username}\'`;
    return pool.query(deleteUserQuery);
  }
}

module.exports = new User();
