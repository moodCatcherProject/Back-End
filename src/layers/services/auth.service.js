const authRepository = require("../repositories/auth.repository");
const exception = require("../exceptModels/_.models.loader");
const bcrypt = require("bcrypt");


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



// EM :8자~ 30자
// PW :영소대문자+숫자+특수문자 8자 ~ 20자
// NN : 한글, 영소 대문자. 숫자 2자~16자


/**
 * @param {string} email 
 * @param {string} password 
 */
const localLogin = async (email, password) => {

    new exception.isString({ email }).trim //빈문자열 확인OK, 숫자타입 확인X, 값이null 확인X
    new exception.isString({ password }).trim

    const exUser = await authRepository.findByEmail(email);
    if (!exUser) throw new exception.NotFoundException("회원정보가 일치하지 않습니다.");

    //bcrypt 해쉬암호 확인용 코드
    //const hashPW = await bcrypt.hash(password, 12)
    //console.log(hashPW)

    const result = await bcrypt.compare(
        password,
        exUser.password
    );
    if (!result) throw new exception.NotFoundException("회원정보가 일치하지 않습니다.");

    return;

}


module.exports = {
    localSignUp,
    localLogin
};