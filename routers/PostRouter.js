const Router = require('express');
const PostController = require('./../controllers/PostController.js');
const { check } = require('express-validator');
const authMiddleware = require('./../middleware/AuthMiddleware.js');

const postRouter = new Router();

postRouter.post('/wall-posts', [authMiddleware], PostController.addPost);

module.exports = postRouter;
