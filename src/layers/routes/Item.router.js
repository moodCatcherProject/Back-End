const express = require('express');
const itemRouter = express.Router();
const itemController = require('../controllers/item.controller');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/authMiddle');

//무신사 상품 찾기(/api/musinsa/:keyword)
itemRouter.get('/:keyword', itemController.crawlingMusinsa);

module.exports = itemRouter;
