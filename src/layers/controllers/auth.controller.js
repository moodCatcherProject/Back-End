const authService = require("../services/auth.service");
const joi = require("joi");

// 주석 달기 , auth router 연결

const localSignUp = async (req, res, next) => {
    const { email, nickname, password, confirmPw } = req.body;
    try {
        await joi
            .object({
                email: joi.string().email().min(8).max(30).trim().required(),
                nickname: joi.string().min(2).max(16).trim().required(), // 닉네임 정규식 , 닉네임 중복확인
                password: joi.number().min(8).max(20).trim().required(), // 비밀번호 정규식
                confirmPw: joi.number().trim().required(),
            })
            .validateAsync({
                email,
                nickname,
                password,
                confirmPw,
            });
        const signUp = await authService.localSignUp(
            email,
            nickname,
            password,
            confirmPw
        );
        return res.status(200).json({ signUp }); // 에러처리
    } catch (error) {
        console.error(error);
        next(err);
    }
};
module.exports = { localSignUp };

// EM :8자~ 30자
// PW :영소대문자+숫자+특수문자 8자 ~ 20자
// NN : 한글, 영소 대문자. 숫자 2자~16자
