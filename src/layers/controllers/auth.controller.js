const e = require('express');
const authService = require('../services/auth.service');
const exception = require('../exceptModels/_.models.loader');
const passport = require('passport');
const { User } = require('../../sequelize/models');
const jwt = require('jsonwebtoken');

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const localSignUp = async (req, res, next) => {
    const { email, password, confirmPw } = req.body;
    try {
        const signUp = await authService.localSignUp(email, password, confirmPw);
        return res.status(201).json(new exception.FormDto('회원가입 성공', { signUp }));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const updateNicknameAgeGender = async (req, res, next) => {
    const userId = req.user.userId;
    const { nickname, age, gender } = req.body;
    try {
        const updateNicknameAgeGender = await authService.updateNicknameAgeGender(
            nickname,
            age,
            gender,
            userId
        );
        return res.status(201).json(
            new exception.FormDto('닉네임, 성별, 나이 추가 성공', {
                updateNicknameAgeGender
            })
        );
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const checkEmail = async (req, res, next) => {
    const { email } = req.query;
    try {
        await authService.checkEmail(email);
        return res.status(200).json(new exception.FormDto('이메일 확인 성공'));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const checkNickname = async (req, res, next) => {
    const { nickname } = req.query;
    try {
        await authService.checkNickname(nickname);
        return res.status(200).json(new exception.FormDto('닉네임 확인 성공'));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const localLogin = async (req, res, next) => {
    //? local로 실행이 되면 localstrategy.js를 찾아 실행한다.
    passport.authenticate('local', (authError, user, info) => {
        //? (authError, user, info) => 이 콜백 미들웨어는 localstrategy에서 done()이 호출되면 실행된다.
        //? localstrategy에 done()함수에 로직 처리에 따라 1,2,3번째 인자에 넣는 순서가 달랐는데 그 이유가 바로 이것이다.

        // done(err)가 처리된 경우
        if (authError) {
            console.error(authError);
            return next(authError); // 에러처리 미들웨어로 보낸다.
        }

        if (!user) {
            // done()의 3번째 인자 { message: '비밀번호가 일치하지 않습니다.' }가 실행
            return res.status(404).send(info.message);
        }

        //? done(null, exUser)가 처리된경우, 즉 로그인이 성공(user가 false가 아닌 경우), passport/index.js로 가서 실행시킨다.
        return req.login(user, (loginError) => {
            try {
                //? loginError => 미들웨어는 passport/index.js의 passport.deserializeUser((id, done) => 가 done()이 되면 실행하게 된다.
                // 만일 done(err) 가 됐다면,
                if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                }

                // done(null, user)로 로직이 성공적이라면, 세션에 사용자 정보를 저장해놔서 로그인 상태가 된다.
                isExistUserNickname(req.user.authId).then((data) => {
                    const exist = data.nickname ? true : false;
                    const token = jwt.sign({ userId: req.user.authId }, process.env.SECRET_KEY, {
                        expiresIn: '1h'
                    });
                    res.header({ authorization: `Bearer ${token}` });
                    res.status(200).redirect(
                        `http://localhost:3000/?exist=${exist}&token=${token}`
                    );
                });
            } catch (err) {
                console.log(err);
                return;
            }
        });
    })(req, res, next); //! 미들웨어 내의 미들웨어에는 콜백을 실행시키기위해 (req, res, next)를 붙인다.
};

/**
 *
 * @param  userId
 * @returns userId로 찾은 User 데이터 반환
 */
const isExistUserNickname = async (userId) => {
    return await User.findOne({
        where: { userId }
    });
};

const kakaoCallback = async (req, res, next) => {
    try {
        console.log('여기');
        //카카오 Strategy에서 성공한다면 콜백 실행
        isExistUserNickname(req.user.authId).then((data) => {
            const exist = data.nickname ? true : false;
            const token = jwt.sign({ userId: req.user.authId }, process.env.SECRET_KEY, {
                expiresIn: '1h'
            });
            // const refreshToken = jwt.sign({}, process.env.SECRET_KEY , {
            //     expiresIn : '1w'
            // }) 리프레시 토큰을 사용할 지 팀원과 논의하기
            res.header({ authorization: `Bearer ${token}` });
            //카카오 Strategy에서 성공한다면 콜백 실행
            res.status(200).redirect(
                `http://localhost:3000/login/detail?exist=${exist}&token=${token}`
            );
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    localSignUp,
    updateNicknameAgeGender,
    checkEmail,
    checkNickname,
    localLogin,
    kakaoCallback
};
