const authRepository = require('../repositories/auth.repository');
const exception = require('../exceptModels/_.models.loader');

// EM :8자~ 30자
// PW :영소대문자+숫자+특수문자 8자 ~ 20자
// NN : 한글, 영소 대문자. 숫자 2자~16자

/**
 * @throws { Error } @param { string } email @param { string } password @param { string } confirmPw
 * @returns { Promise<{ email: string, password: string }> } 이메일,비밀번호 생성
 */
const localSignUp = async (email, password, confirmPw) => {
    const ExistUser = await authRepository.findByEmail(email);
    if (ExistUser) {
        throw new exception.BadRequestException('이메일 중복 확인 실패');
    }

    if (password !== confirmPw) {
        throw new exception.BadRequestException('비밀번호 에러');
    }

    const SignUp = await authRepository.createSignUp(email, password);

    return SignUp;
};
/**
 * @throws { Error } @param { string } nickname @param {string} age
 * @returns { Promise<{ nickname: string, age: string }> } null이였던 nickname / age / gender 업데이트
 */
const updateNicknameAgeGender = async (nickname, userId, age, gender) => {
    const updatedNicknameAgeGender = await authRepository.updateNicknameAgeGender(
        nickname,
        age,
        gender,
        userId
        // 닉네임이 중복 될 경우
    );

    return updatedNicknameAgeGender;
};
/**
 * @throws { Error } @param { string } email
 * @returns { Promise<{ email: string }> }
 */
const checkEmail = async (email) => {
    const ExisEmail = await authRepository.findByEmail(email);
    if (ExisEmail) {
        throw new exception.BadRequestException('이메일 중복확인 실패');
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
        throw new exception.BadRequestException('닉네임 중복확인 실패');
    }
    return ExisNickname;
    // if 닉네임 유효성 검사 정규식
};
const deleteUser = async (userId) => {
    await authRepository.deleteUser(userId);
    return;
};

module.exports = {
    localSignUp,
    updateNicknameAgeGender,
    checkEmail,
    checkNickname,
    deleteUser
};
