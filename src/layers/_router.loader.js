const router = require('express').Router();
const { isLoggedIn, isNotLoggedIn } = require('./routes/middlewares/authMiddle');
const itemRouter = require('./routes/item.router');
const authRouter = require('./routes/auth.router');
const commentRouter = require('./routes/comment.router');
const reCommentRouter = require('./routes/recomment.router');
const postRouter = require('./routes/post.router');
const userRouter = require('./routes/user.router');

router.get('/start');
router.use('/musinsa', itemRouter);
router.use('/auth', authRouter);
router.use('/comments', commentRouter);
router.use('/recomments', reCommentRouter);
router.use('/posts', postRouter);
router.use('/users', userRouter);
module.exports = router;
