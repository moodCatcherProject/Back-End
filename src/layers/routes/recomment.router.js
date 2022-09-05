const express = require('express');
const reCommentRouter = express.Router();
const reCommentController = require('../controllers/recomment.controller');

const { isLoggedIn } = require('./middlewares/authMiddle');

// 대댓글 작성 (/api/recomments?commentId)
reCommentRouter.post('/', isLoggedIn, reCommentController.createReComment);

// 대댓글 수정 (/api/recomments/:recommentId)
reCommentRouter.put('/:recommentId', isLoggedIn, reCommentController.updateReComment);

// 대댓글 삭제 (/api/recomments/:recommentId)
reCommentRouter.delete('/:recommentId', isLoggedIn, reCommentController.deleteReComment);

module.exports = reCommentRouter;

// commentId와 recommentId가 서로 참조하고있는 키 라서 생성/삭제 불가
// REFERENCES
// foreign key

// 대댓글 수정 삭제 기능 돌아가게끔만 구현 완료 예외처리 댓글 보면서 하면 될듯?
