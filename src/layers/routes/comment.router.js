const express = require('express');
const commentRouter = express.Router();
const commentController = require('../controllers/comment.controller');

// 댓글 작성(/api/comments?postId)
commentRouter.post('/', commentController.createComment);

// 댓글 수정 (/api/comments/:commentId)
commentRouter.put('/:commentId', commentController.updateComment);

// 댓글 삭제 (/api/comments/:commentId)
commentRouter.delete('/:commentId', commentController.deleteComment);

module.exports = commentRouter;
