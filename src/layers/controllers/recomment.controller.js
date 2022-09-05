const e = require('express');
const reCommentService = require('../services/recomment.service');
const exception = require('../exceptModels/_.models.loader');

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const createReComment = async (req, res, next) => {
    const { commentId } = req.query;
    const { content } = req.body;
    const userId = req.user.userId;

    try {
        const createReComment = await reCommentService.createReComment(commentId, content, userId);
        return res.status(201).json(new exception.FormDto('대댓글 생성 성공', { createReComment }));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const updateReComment = async (req, res, next) => {
    const { recommentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    try {
        await reCommentService.updateReComment(recommentId, content, userId);
        return res.status(200).json(new exception.FormDto('대댓글 수정 성공'));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const deleteReComment = async (req, res, next) => {
    const { recommentId } = req.params;
    const userId = req.user.userId;

    try {
        await reCommentService.deleteReComment(recommentId, userId);
        return res.status(200).json(new exception.FormDto('대댓글 삭제 성공'));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createReComment,
    updateReComment,
    deleteReComment
};
