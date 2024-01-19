const pool = require('./Pool.js');

class Wall {
  async checkAddPostPermission(user_id, group_id, wall_id) {
    const query = 'SELECT * FROM walls WHERE wall_id = $1';
    const selectWallRes = await pool.query(query, [wall_id]);

    if (selectWallRes.rows.length === 0) {
      throw new Error('Wall not found');
    }

    const wall = selectWallRes.rows[0];

    if (
      wall.permission === 'all' ||
      user_id === wall.wall_user_id ||
      group_id === wall.wall_group_id
    ) {
      return true;
    } else if (wall.permission === 'members-or-friends') {
      // Check if a member or a friend
      const isMemberOrFriend = await this.isUserMemberOrFriend(
        user_id,
        wall_id
      );
      return isMemberOrFriend;
    }

    return false;
  }

  async isUserMemberOrFriend(user_id, wall_id) {
    // Implement logic to check if user is a member or friend
    // ...

    // For now, let's return true for the sake of example
    return true;
  }
}

module.exports = new Wall();
