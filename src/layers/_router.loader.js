const router = require("express").Router();

const searchRouter = require("./routes/Item.router");
const authRouter = require("./routes/auth.router");

router.use("/search", searchRouter);
router.use("/auth", authRouter);

module.exports = router;
