const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");
const passport = require("passport");

authRouter.route("/login").post(authController.localLogin);

// 회원가입 , URL : /api/auth/signup
authRouter.post("/signup", authController.localSignUp);
// 닉네임/나이/성별 추가 , URL : /api/auth/detail
authRouter.post("/detail", authController.createNicknameAgeGender);
// 이메일 확인 , URL : /api/auth?email
authRouter.get("/", authController.checkEmail);
// 닉네임 확인 , URL : /api/auth?nickname
authRouter.get("/", authController.checkNickname);
//카카오 로그인
authRouter.get("/kakao", passport.authenticate("kakao"));

authRouter.get(
    "/kakao/callback",
    passport.authenticate("kakao", {
        failureRedirect: "/",
    }),
    (req, res) => {
        //카카오 Strategy에서 성공한다면 콜백 실행
        res.status(200).send("카카오 로그인 성공했습니다!");
    }
);

authRouter.get("/kakao/disconnect");
module.exports = authRouter;
