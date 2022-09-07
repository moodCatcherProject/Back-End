const express = require('express');
const likeRouter = express.Router();
const likeController = require('../controllers/like.controller');
const exception = require('../exceptModels/_.models.loader');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/authMiddle');

// 좋아요 등록/취소(/api/like)
// likeRouter.patch('/', likeController.pressLike);

module.exports = likeRouter;
