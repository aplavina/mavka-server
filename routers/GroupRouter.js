const Router = require('express');
const GroupController = require('../controllers/GroupController.js');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/AuthMiddleware.js');

const groupRouter = new Router();

groupRouter.get('/groups', [authMiddleware], GroupController.getAll);

groupRouter.post(
  '/groups',
  [
    check('group_name', 'Group name can not be empty').notEmpty(),
    authMiddleware,
  ],
  GroupController.addGroup
);

groupRouter.post(
  '/groups/:group_id',
  [authMiddleware],
  GroupController.joinGroup
);

module.exports = groupRouter;
