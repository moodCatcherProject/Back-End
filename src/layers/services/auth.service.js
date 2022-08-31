const authRepository = require("../repositories/auth.repository");
const Exception = require("../exceptModels/_.models.loader");


/**
 * @throws { Error } @param { string } email @param { string } password @param { string } confirmPw
 * @returns { Promise<{ email: string, password: string }> } 이메일,비밀번호 생성
 */
const localSignUp = async (email, password, confirmPw) => {
    const ExistUser = await authRepository.findByEmail(email);
    if (email === ExistUser.email) {
        throw new Exception.BadRequestException("이메일 중복 확인 실패");
    }
    if (password !== confirmPw) {
        throw new Exception.BadRequestException("비밀번호 에러");
    }
    const SignUp = await authRepository.createSignUp(email, password);

    return SignUp;
};

module.exports = { localSignUp };

