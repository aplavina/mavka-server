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

  async getGroupWalls() {
    const query =
      'SELECT wall_id, wall_group_id, wall_img, wall_title, wall_theme FROM walls WHERE wall_group_id IS NOT NULL';
    const queryRes = await pool.query(query);
    return queryRes.rows;
  }

  async searchGroupWalls(title, theme) {
      console.log(title);
      console.log(theme);
      const themes = [
          { id: "0", name: "Юмор" },
          { id: "1", name: "Спорт" },
          { id: "2", name: "Игры" },
          { id: "3", name: "Еда" },
          { id: "4", name: "Музыка" },
          { id: "5", name: "Фотография" },
          { id: "6", name: "Финансы" },
          { id: "7", name: "Информационные технологии" },
          { id: "8", name: "Кино" },
          { id: "9", name: "Наука" }
      ];

      let query = 'SELECT * FROM walls WHERE wall_group_id IS NOT NULL'
      let queryParams = [];
      if (theme !== "" && themes.some(t => t.id === theme)) {
          query = query + ' AND wall_theme = $1';
          if (title !== "") {
              query = query + ' AND wall_title ILIKE $2';
              queryParams = [themes[parseInt(theme)].name, title + "%"];
          } else {
              queryParams = [themes[parseInt(theme)].name];
          }
      } else {
        if (title !== "") {
            query = query + ' AND wall_title ILIKE $1';
            queryParams = [title + "%"];
        }
      }
      console.log(query);
      console.log(queryParams);
      const queryRes = await pool.query(query, queryParams);
      console.log(queryRes.rows);

      const exampleWall = {
        wall_id: "0",
        title: "Я Тайлер",
        image_url: "https://media.tatler.ru/photos/619795a8c2aa8983556eaf97/3:2/w_656,h_437,c_limit/327893448828.jpg",
        description: "description 0",
        owner_id: "200006",
        admin_id: "200006",
        is_available: true,
        category_id: "0",
        created_at: "2027-07-27",
        category: {id: "0", name: "Юмор"}, 
        wall_posts: [{wall_post_id: 0}, {wall_post_id: 1}, {wall_post_id: 2}, {wall_post_id: 3}, {wall_post_id: 4}, {wall_post_id: 5}]
      }
      
      for (let i = 0; i < queryRes.rows.length; i++) {
          const currWall = queryRes.rows[i];
          
          if (!theme) {
            const theme_full = themes.find(theme => theme.name === currWall["wall_theme"]);
            theme = theme_full.id;
          }
          currWall['image_url'] = currWall["wall_img"];
          delete currWall['wall_img'];
          currWall['title'] = currWall["wall_title"];
          delete currWall['wall_title'];
          currWall["category"] = themes[parseInt(theme)];
          delete currWall["wall_theme"];
          currWall["category_id"] = parseInt(theme);
          delete currWall["permission"];
          delete currWall["wall_user_id"];
          delete currWall["wall_id"];
          for (const key in exampleWall) {
              if (!(key in currWall)) {
                  currWall[key] = exampleWall[key];
              }
          }
      }
      console.log(queryRes.rows);
      return queryRes.rows;
  }

  // async isUserMemberOrFriend(user_id, wall_id) {
  //   // Implement logic to check if user is a member or friend
  //   // ...

  //   // For now, let's return true for the sake of example
  //   return true;
  // }
}

module.exports = new Wall();
