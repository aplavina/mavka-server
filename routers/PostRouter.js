const Router = require('express');
const PostController = require('./../controllers/PostController.js');
const { check } = require('express-validator');
const authMiddleware = require('./../middleware/AuthMiddleware.js');

const postRouter = new Router();

postRouter.post('/wall-post', [authMiddleware], PostController.addPost);
postRouter.get(
  '/wall-post/:wall_id',
  [authMiddleware],
  PostController.getWallPosts
);

module.exports = postRouter;
