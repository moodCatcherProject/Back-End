const e = require('express');
const authService = require("../services/auth.service");
const exception = require("../exceptModels/_.models.loader");
const joi = require("joi");



/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const localSignUp = async (req, res, next) => {
    const { email, password, confirmPw } = req.body;
    try {
        await joi
            .object({
                email: joi.string().email().min(8).max(30).trim().required(),
                password: joi.string().trim().required(),
                confirmPw: joi.string().trim().required(),
            })
            .validateAsync({
                email,
                password,
                confirmPw,
            });
        const signUp = await authService.localSignUp(
            email,
            password,
            confirmPw
        );
        return res.status(201).json(
            new exception.FormDto("회원가입 성공", {
                signUp,
            })
        );
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// EM :8자~ 30자
// PW :영소대문자+숫자+특수문자 8자 ~ 20자
// NN : 한글, 영소 대문자. 숫자 2자~16자


/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const localLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        await authService.localLogin(
            email,
            password
        );

        return res.status(200).json(
            new exception.FormDto("로그인 성공")
        );
    } catch(err) {
        next(err);

    }
}


// const checkNickname = async (req, res, next) => {
//     const { nickname } = req.query;
//     try {
//         await joi
//             .object({
//                 nickname: joi.string().min(2).max(16).trim().required(), // 닉네임 정규식 , 닉네임 중복확인
//             })
//             .validateAsync({
//                 nickname,
//             });
//         const checkNickname = await authService.checkNickname(nickname);
//         return res.status(200).json(
//             new exception.FormDto("닉네임 확인 성공", {
//                 checkNickname,
//             })
//         );
//     } catch (error) {
//         console.error(error);
//         next(err);
//     }
// };

module.exports = { 
    localSignUp,
    localLogin
 };
