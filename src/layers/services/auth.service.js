const authRepository = require("../repositories/auth.repository");
const Exception = require("../exceptModels/_.models.loader");

/**
 * @throws { Error } @param { string } email @param { string } password @param { string } confirmPw
 * @returns { Promise<{ email: string, password: string }> } 이메일,비밀번호 생성
 */
const localSignUp = async (email, password, confirmPw) => {
    const ExistUser = await authRepository.findByEmail(email);
    if (ExistUser) {
        throw new Exception.BadRequestException("이메일 중복 확인 실패");
    }
    if (password !== confirmPw) {
        throw new Exception.BadRequestException("비밀번호 에러");
    }
    const SignUp = await authRepository.createSignUp(email, password);
    return SignUp;
};
/**
 * @throws { Error } @param { string } nickname @param {string} age
 * @returns { Promise<{ nickname: string, age: string }> } 닉네임,나이 생성
 */
const createNicknameAge = async (nickname, age) => {
    const createdNicknameAge = await authRepository.createNicknameAge(
        nickname,
        age
        // 닉네임이 중복 될 경우
    );
    return createdNicknameAge;
};
/**
 * @throws { Error } @param { string } email
 * @returns { Promise<{ email: string }> }
 */
const checkEmail = async (email) => {
    const ExisEmail = await authRepository.findByEmail(email);
    if (ExisEmail) {
        throw new Exception.BadRequestException("이메일 중복확인 실패");
    }
    return ExisEmail;
};
/**
 * @throws { Error } @param { string } nickname
 * @returns { Promise<{ nickname: string }> }
 */
const checkNickname = async (nickname) => {
    const ExisNickname = await authRepository.findByNickname(nickname);
    if (ExisNickname) {
        throw new Exception.BadRequestException("닉네임 중복확인 실패");
    }
    return ExisNickname;
    // if 닉네임 유효성 검사 정규식
};
module.exports = { localSignUp, createNicknameAge, checkEmail, checkNickname };
