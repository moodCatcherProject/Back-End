const e = require('express');
const commentService = require('../services/comment.service');
const exception = require('../exceptModels/_.models.loader');

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const createComment = async (req, res, next) => {
    const { postId } = req.query;
    const { content } = req.body;
    const { userId, nickname, grade, imgUrl } = res.locals.user;

    try {
        const createComment = await commentService.createComment(postId, content, userId);
        createComment.dataValues.nickname = nickname;
        createComment.dataValues.grade = grade;
        createComment.dataValues.imgUrl = process.env.S3_STORAGE_URL + imgUrl;
        return res
            .status(201)
            .json(new exception.FormDto('댓글 생성 성공', { comment: { createComment } }));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const getComments = async (req, res, next) => {
    const { postId } = req.query;
    const { userId } = res.locals.user;
    try {
        const page = Number(req.query.page || 1);
        const count = Number(req.query.count || 8);
        const getComments = await commentService.getComments(postId, page, count, userId);
        return res
            .status(200)
            .json(new exception.FormDto('댓글 조회 성공', { comments: getComments }));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const updateComment = async (req, res, next) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const { userId, nickname, grade, imgUrl } = res.locals.user;

    try {
        const updateComment = await commentService.updateComment(commentId, content, userId);
        updateComment.dataValues.nickname = nickname;
        updateComment.dataValues.grade = grade;
        updateComment.dataValues.imgUrl = imgUrl;
        return res
            .status(200)
            .json(new exception.FormDto('댓글 수정 성공', { comment: updateComment }));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const deleteComment = async (req, res, next) => {
    const { commentId } = req.params;
    const { userId } = res.locals.user;

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
