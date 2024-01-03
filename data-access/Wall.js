const pool = require('./Pool.js');

class Wall {
  async checkAddPostPermission(user_id, group_id, wall_id) {
    const query = `SELECT * FROM walls WHERE wall_id = ${wall_id}`;
    const select_wall_res = await pool.query(query);
    if (select_wall_res.rows.length == 0) {
      throw new Error('Wall not found');
    }
    const wall = select_wall_res.rows[0];
    if (
      wall.permission == 'all' ||
      user_id == wall.wall_user_id ||
      group_id == wall.wall_group_id
    ) {
      return true;
    } else if (wall.permission == 'members-or-friends') {
      //check if a memeber or a friend
      return true;
    }
    return false;
  }
}

module.exports = new Wall();
