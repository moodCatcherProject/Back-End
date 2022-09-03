const e = require('express');
const commentService = require('../services/comment.service');
const exception = require('../exceptModels/_.models.loader');

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const createComment = async (req, res, next) => {
    const userId = req.user.userId;
    const { content } = req.body;
    const { postId } = req.query;

    try {
        const createComment = await commentService.createComment(userId, content, postId);
        return res.status(201).json(new exception.FormDto('댓글 생성 성공', { createComment }));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const updateComment = async (req, res, next) => {
    const userId = req.user.userId;
    const { content } = req.body;
    const { commentId } = req.params;

    try {
        await commentService.updateComment(userId, content, commentId);
        return res.status(200).json(new exception.FormDto('댓글 수정 성공'));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const deleteComment = async (req, res, next) => {
    const userId = req.user.userId;
    const { commentId } = req.params;

    try {
        await commentService.deleteComment(userId, commentId);
        return res.status(200).json(new exception.FormDto('댓글 삭제 성공'));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createComment,
    updateComment,
    deleteComment
};
