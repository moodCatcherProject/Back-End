const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares/authMiddle');

// 회원가입(/api/auth/signup)
authRouter.post('/signup', isNotLoggedIn, authController.localSignUp);

// 이메일 확인(/api/auth/checkEmail?email)
authRouter.get('/checkEmail', isNotLoggedIn, authController.checkEmail);

// 인증번호 발송(/api/auth/sendEmail) (sendAuthNum과 sendEmail중에 고민 중)
authRouter.post('/sendEmail', isNotLoggedIn, authController.sendEmail);

// 비밀번호 찾기(/api/auth/forgetPw) (findPw와 forgetPw중에 고민 중)
authRouter.post('/forgetPw', isNotLoggedIn, authController.forgetPw);

// 비밀번호 변경(/api/auth/updatePw?email) (changePw와 updatePw중에 고민 중)
authRouter.put('/updatePw', isNotLoggedIn, authController.updatePw);

// 닉네임 확인(/api/auth/checkNickname?nickname)
authRouter.get('/checkNickname', isLoggedIn, authController.checkNickname);

// 닉네임/나이/성별 추가(/api/auth/detail)
authRouter.post('/detail', isLoggedIn, authController.updateNicknameAgeGender);

// 로컬로그인(/api/auth/login)
authRouter.post('/login', isNotLoggedIn, authController.localLogin);

//카카오 로그인(/api/auth/kakao)
authRouter.get('/kakao', isNotLoggedIn, passport.authenticate('kakao'));
//카카오 콜백(/api/auth/kakao/callback)
authRouter.get(
    '/kakao/callback',
    isNotLoggedIn,
    passport.authenticate('kakao', {
        failureRedirect: '/'
    }),
    authController.kakaoCallback
);
authRouter.get('/kakao/disconnect');

module.exports = authRouter;
