const authRepository = require("../repositories/auth.repository");
const Exception = require("../exceptModels/_.models.loader");
const joi = require("joi");

const localSignUp = async (email, nickname, password, confirmPw) => {
    const ExistUser = await authRepository.findByEmail(email);
    if (ExistUser) {
        return res.redirect("/signup?error=exist");
    }
    // 이메일 타입 확인
    // 비밀번호 정규식 확인
    if (password !== confirmPw) {
        return { msg: "비번 비번확인 다름" }; // 임시
    }
    if (email === ExistUser) {
        return { msg: "이멜 중복" }; // 임시
    }
    const SignUp = await authRepository.createSignUp(email, nickname, password);
    return SignUp;
};

module.exports = { localSignUp };

// EM :8자~ 30자
// PW :영소대문자+숫자+특수문자 8자 ~ 20자
// NN : 한글, 영소 대문자. 숫자 2자~16자
