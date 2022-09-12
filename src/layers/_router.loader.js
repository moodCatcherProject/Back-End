const router = require('express').Router();
const { isLoggedIn, isNotLoggedIn } = require('./routes/middlewares/authMiddle');
const startRouter = require('./routes/start.router');
const itemRouter = require('./routes/item.router');
const authRouter = require('./routes/auth.router');
const commentRouter = require('./routes/comment.router');
const reCommentRouter = require('./routes/recomment.router');
const postRouter = require('./routes/post.router');
const userRouter = require('./routes/user.router');
const likeRouter = require('./routes/like.router');
const noticeRouter = require('./routes/notice.router');

router.use('/start', startRouter);
router.use('/musinsa', itemRouter);
router.use('/auth', authRouter);
router.use('/comments', commentRouter);
router.use('/recomments', reCommentRouter);
router.use('/posts', isLoggedIn, postRouter);
router.use('/users', userRouter);
router.use('/like', likeRouter);
router.use('/notice', isLoggedIn, noticeRouter);

module.exports = router;
