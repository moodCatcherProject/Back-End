const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");

authRouter.route("/login").post(authController.localLogin)

// 회원가입 , URL /api/auth/signup
authRouter.post("/signup", AuthController.localSignUp);
// // 이메일 확인 , URL /api/auth?email
// authRouter.get("/", authController.checkEmail);
// // 닉네임 확인 , URL /api/auth?nickname
// authRouter.get("/", authController.checkNickname);


module.exports = authRouter;

