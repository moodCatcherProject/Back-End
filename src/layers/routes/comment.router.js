const express = require('express');
const commentRouter = express.Router();
const commentController = require('../controllers/comment.controller');

const { isLoggedIn } = require('./middlewares/authMiddle');

// 댓글 작성(/api/comments?postId)
commentRouter.post('/', isLoggedIn, commentController.createComment);
// 1. 로그인을 하고 닉네임 나이 성별은 추가하지 않아도 댓글을 달 수 있다.
// 2. 댓글 작성 은 nickname, grade, imgUrl 을 response 해야한다.
// 3. 로그인을 하고 닉네임 나이 성별을 추가하지않고 댓글을 작성 할 수 있는 상황.

// 댓글 작성할때 services에서 nickname, grade, imgUrl가 없을때 작성 못하도록
// 댓글 수정할때 response nickname, grade, imgUrl
// 댓글 조회

// 댓글 조회(/api/comments?postId&page&count)
commentRouter.get('/', isLoggedIn, commentController.getComments);

// 댓글 수정 (/api/comments/:commentId)
commentRouter.put('/:commentId', isLoggedIn, commentController.updateComment);

// 댓글 삭제 (/api/comments/:commentId)
commentRouter.delete('/:commentId', isLoggedIn, commentController.deleteComment);

module.exports = commentRouter;
