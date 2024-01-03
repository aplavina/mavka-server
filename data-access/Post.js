const pool = require('./Pool.js');

class Post {
  async readPostsFromWall(wall_id, pageNumber, pageSize) {
    const offset = (pageNumber - 1) * pageSize;
    query = `SELECT post_id, username, first_name, last_name, group_id, group_name, post_text, reposted_post_id
    FROM posts WHERE wall_id = ${wall_id}`;
  }

  async addPost(wall_id, user_id, group_id, post_text, reposted_post_id) {
    if (group_id == null && user_id == null) {
      throw new Error('Need user_id or group_id');
    }
    let query = `INSERT INTO posts(wall_id, user_id, post_text)
                   VALUES(${wall_id}, ${user_id}, \'${post_text}\') RETURNING post_id`;

    if (!user_id) {
      query = `INSERT INTO posts(wall_id, group_id, post_text)
               VALUES(${wall_id}, ${group_id}, \'${post_text}\') RETURNING post_id`;
    }

    const client = await pool.connect();
    await client.query('BEGIN');
    try {
      const create_post_res = await client.query(query);
      let post_id = create_post_res.rows[0].post_id;
      if (reposted_post_id) {
        query = `UPDATE posts SET reposted_post_id = ${reposted_post_id}
                 WHERE post_id = ${post_id}`;
        await client.query(query);
      }
      await client.query('COMMIT');
    } catch (exc) {
      await client.query('ROLLBACK');
      throw exc;
    } finally {
      client.release();
    }
  }
}

module.exports = new Post();
