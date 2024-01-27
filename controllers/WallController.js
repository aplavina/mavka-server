const Wall = require('./../data-access/Wall');

class WallController {
  async getGroupWalls(req, res) {
    try {
      const queryRes = await Wall.getGroupWalls();
      return res.status(200).json(queryRes);
    } catch (exc) {
      console.log(exc.message);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async searchGroupWalls(req, res) {
    try {
        console.log(req.body);
        const queryRes = await Wall.searchGroupWalls(
            req.body.title,
            req.body.category_id
        );
        return res.status(200).json(queryRes);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
  }

  async getWallThemes(req, res) {
    try {
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

        res.status(200).json(themes);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new WallController();
