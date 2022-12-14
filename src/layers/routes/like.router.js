const express = require('express');
const likeRouter = express.Router();
const likeController = require('../controllers/like.controller');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/authMiddle');

// 좋아요 등록/취소(/api/like)
likeRouter.patch('/', isLoggedIn, likeController.toggleLike);

module.exports = likeRouter;
