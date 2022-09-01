const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/authMiddle');


// 회원가입(/api/auth/signup)
authRouter.post("/signup", authController.localSignUp);
// // 이메일 확인(/api/auth/checkEmail?email)
// authRouter.get("/checkEmail", authController.checkEmail);
// // 닉네임 확인(/api/auth/checkNickname?nickname)
// authRouter.get("/checkNickname", authController.checkNickname);
// 닉네임/나이/성별 추가(/api/auth/detail)
authRouter.post("/detail", authController.createNicknameAgeGender);

// 로컬로그인(/api/auth/login)
authRouter.post("/login", authController.localLogin);

//카카오 로그인(/api/auth/kakao)
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
