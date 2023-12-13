const Group = require('./../data-access/Group');
const { validationResult } = require('express-validator');

class GroupController {
  async getAll(req, res) {
    try {
      const queryRes = await Group.getAll().rows;
      res.status(200).json(queryRes);
    } catch (exc) {
      console.log(exc);
      res.status(500).json(exc);
    }
  }

  async addGroup(req, res) {
    try {
      const queryRes = await Group.addGroup(req.body.group_name, req.user_id);
      res.status(200).json(queryRes);
    } catch (exc) {
      console.log(exc);
      res.status(500).json(exc);
    }
  }

  async joinGroup(req, res) {
    const goup_id = req.params.group_id;
    const user_id = req.user_id;
    try {
      const queryRes = await Group.joinGroup(group_id, user_id);
      res.status(200).json({ message: 'Success' });
    } catch (exc) {
      console.log(exc);
      res.status(500).json(exc);
    }
  }
}

module.exports = new GroupController();
