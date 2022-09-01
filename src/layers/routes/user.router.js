const express = require("express");
const userRouter = express.Router();
const exception = require("../exceptModels/_.models.loader");
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/authMiddle');


// 로그아웃(api/user/logout)
userRouter.get("/logout", isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.status(200).json(
        new exception.FormDto("로그아웃 성공")
    );
})

module.exports = userRouter;