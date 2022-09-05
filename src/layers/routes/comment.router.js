const express = require('express');
const commentRouter = express.Router();
const commentController = require('../controllers/comment.controller');

const { isLoggedIn } = require('./middlewares/authMiddle');

// 댓글 작성(/api/comments?postId)
commentRouter.post('/', isLoggedIn, commentController.createComment);

// 댓글 수정 (/api/comments/:commentId)
commentRouter.put('/:commentId', isLoggedIn, commentController.updateComment);

// 댓글 삭제 (/api/comments/:commentId)
commentRouter.delete('/:commentId', isLoggedIn, commentController.deleteComment);

module.exports = commentRouter;
