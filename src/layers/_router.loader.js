const router = require("express").Router();
const {isLoggedIn, isNotLoggedIn} = require("./routes/middlewares/authMiddle")
const searchRouter = require("./routes/Item.router");
const authRouter = require("./routes/auth.router");
const postRouter = require("./routes/post.router")

router.use("/search", searchRouter);
router.use("/auth", authRouter);
router.use("/posts" , postRouter);

module.exports = router;
