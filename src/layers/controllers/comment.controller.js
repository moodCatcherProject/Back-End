const e = require('express');
const commentService = require('../services/comment.service');
const exception = require('../exceptModels/_.models.loader');

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const createComment = async (req, res, next) => {
    const { postId } = req.query;
    const { content } = req.body;
    const userId = req.user.userId;

    try {
        const createComment = await commentService.createComment(postId, content, userId);
        return res.status(201).json(new exception.FormDto('댓글 생성 성공', { createComment }));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const getComments = async (req, res, next) => {
    try {
        const postId = req.query;
        const page = Number(req.query.page || 1);
        const count = Number(req.query.count || 8);

        const getComments = await commentService.getComments(postId, page, count);
        return res.status(200).json(new exception.FormDto('댓글 조회 성공', { getComments }));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const updateComment = async (req, res, next) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    try {
        await commentService.updateComment(commentId, content, userId);
        return res.status(200).json(new exception.FormDto('댓글 수정 성공'));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const deleteComment = async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user.userId;

    try {
        await commentService.deleteComment(commentId, userId);
        return res.status(200).json(new exception.FormDto('댓글 삭제 성공'));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment
};
