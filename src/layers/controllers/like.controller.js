const e = require('express');
const likeService = require('../services/like.service');
const exception = require('../exceptModels/_.models.loader');

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const pressLike = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { postId } = req.query;

    const likeStatus = await likeService.pressLike(userId, postId);

    return res.status(201).json(new exception.FormDto('좋아요 변경 성공', { likeStatus }));
};

module.exports = { pressLike };
