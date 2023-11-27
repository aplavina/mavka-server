const Router = require('express');
const UserController = require('../controllers/UserController.js');
const { check } = require('express-validator');
const authMiddleware = require('./../middleware/AuthMiddleware.js');
const privateDataAccess = require('./../middleware/PrivateDataAccess.js');

const userRouter = new Router();

userRouter.get('/users/:username', authMiddleware, UserController.getUser);
userRouter.get(
  '/users/private/:username',
  [authMiddleware, privateDataAccess],
  UserController.getUserPrivateInfo
);
userRouter.put(
  '/users/:username',
  [
    check('username', 'Username can not be empty').notEmpty(),
    check('email', 'Email can not be empty').notEmpty(),
    check(
      'pass',
      'Password length is incorrect - must be 4 to 64 symbols'
    ).isLength({ min: 4, max: 64 }),
    check('first_name', 'First name can not be empty').notEmpty(),
    check('last_name', 'Last name can not be empty').notEmpty(),
    authMiddleware,
    privateDataAccess,
  ],
  UserController.updateUser
);
userRouter.delete(
  '/users/:username',
  [authMiddleware, privateDataAccess],
  UserController.deleteuser
);

module.exports = userRouter;
