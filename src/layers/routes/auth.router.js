const { Router } = require("express");

const authRouter = Router();

const AuthController = require("../controllers/auth.controller");

// 회원가입 , URL : /api/auth/signup
authRouter.post("/signup", AuthController.localSignUp);
// 닉네임/나이 추가 , URL : /api/auth/detail
authRouter.post("/detail", AuthController.createNicknameAgeGender);
// 이메일 확인 , URL : /api/auth?email
authRouter.get("/", AuthController.checkEmail);
// 닉네임 확인 , URL : /api/auth?nickname
authRouter.get("/", AuthController.checkNickname);

module.exports = authRouter;
