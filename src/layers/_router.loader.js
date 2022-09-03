const router = require('express').Router();
const { isLoggedIn, isNotLoggedIn } = require('./routes/middlewares/authMiddle');
const searchRouter = require('./routes/Item.router');
const authRouter = require('./routes/auth.router');
const commentRouter = require('./routes/comment.router');
const postRouter = require('./routes/post.router');
const userRouter = require('./routes/user.router');

router.use('/search', searchRouter);
router.use('/auth', authRouter);
router.use('/comments', commentRouter);
router.use('/posts', postRouter);
router.use('/user', userRouter);

module.exports = router;
