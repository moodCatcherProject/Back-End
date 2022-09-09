const e = require('express');
const likeService = require('../services/like.service');
const exception = require('../exceptModels/_.models.loader');

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const toggleLike = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const { postId } = req.query;

        const likeCountArray = await likeService.toggleLike(userId, postId);

        if (likeCountArray[0] < likeCountArray[1]) {
            return res
                .status(201)
                .json(new exception.FormDto('좋아요 등록 성공', { likeCount: likeCountArray[1] }));
        } else {
            return res
                .status(201)
                .json(new exception.FormDto('좋아요 취소 성공', { likeCount: likeCountArray[1] }));
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { toggleLike };
