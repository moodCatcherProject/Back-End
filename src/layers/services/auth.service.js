const authRepository = require('../repositories/auth.repository');
const userRepository = require('../repositories/user.repository');
const exception = require('../exceptModels/_.models.loader');

// EM : 8자~ 30자 이메일형식
// PW : 영소대문자+숫자+특수문자 8자 ~ 20자
// NN : 한글, 영소 대문자. 숫자 2자~16자

/**
 * 회원가입
 * @param { string } email
 * @param { string } password
 * @param { string } confirmPw
 * @returns { Promise<{ email: string, password: string }> | null }
 */
const localSignUp = async (email, password, confirmPw) => {
    new exception.isString({ email }).value;
    new exception.isString({ password }).value;
    new exception.isString({ confirmPw }).value;

    if (password !== confirmPw) {
        throw new exception.BadRequestException('비밀번호와 비밀번호 확인란이 다릅니다.');
    }

    const checkEmail =
        /^[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
    if (checkEmail.test(email) == false) {
        throw new exception.BadRequestException('이메일 형식 확인 실패!');
    }

    const ExistUser = await authRepository.findByEmail(email);
    if (ExistUser) {
        throw new exception.BadRequestException('이메일 중복 확인 실패!');
    }

    const SignUp = await authRepository.createSignUp(email, password);

    return SignUp;
};

/**
 * 닉네임 나이 성별 추가
 * @param { string } nickname
 * @param {string} age
 * @returns { Promise<{ nickname: string, age: string }> | null }
 */
const updateNicknameAgeGender = async (nickname, age, gender, userId) => {
    new exception.isString({ nickname }).value;
    new exception.isString({ gender }).value;
    new exception.isString({ age }).value;

    const ExistUser = await userRepository.getUserStatusByUserId(userId);
    if (ExistUser.nickname)
        throw new exception.ForbiddenException('초기설정한 유저정보가 있습니다.');

    const checkNickname = /^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{2,16}$/;
    if (checkNickname.test(nickname) == false) {
        throw new exception.BadRequestException('닉네임 유효성 에러');
    }

    if (gender !== '남자' && gender !== '여자') {
        throw new exception.BadRequestException('성별 유효성 에러');
    }

    if (age !== '10대' && age !== '20대' && age !== '30대' && age !== '40대' && age !== '50대') {
        throw new exception.BadRequestException('나이 유효성 에러');
    }

    const ExisNickname = await userRepository.findByNickname(nickname);
    if (ExisNickname) {
        throw new exception.BadRequestException('닉네임 중복확인 실패');
    }

    let grade = 'man 1';
    if (gender === '여자') grade = 'woman 1';

    const updatedNicknameAgeGender = await authRepository.updateNicknameAgeGender(
        nickname,
        age,
        gender,
        userId,
        grade
    );

    return updatedNicknameAgeGender;
};

/**
 * 이메일 중복확인
 * @param { string } email
 * @returns { Promise<{ email: string }> | null }
 */
const checkEmail = async (email) => {
    new exception.isString({ email }).value;

    const checkEmail =
        /^[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
    if (checkEmail.test(email) == false) {
        throw new exception.BadRequestException('이메일 유효성 에러');
    }

    const ExisEmail = await authRepository.findByEmail(email);
    if (ExisEmail) {
        throw new exception.BadRequestException('이메일 중복확인 실패');
    }

    return ExisEmail;
};

/**
 * 닉네임 중복확인
 * @param { string } nickname
 * @returns { Promise<{ nickname: string }> | null }
 */
const checkNickname = async (nickname) => {
    new exception.isString({ nickname }).value;

    const checkNickname = /^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{2,16}$/;
    if (checkNickname.test(nickname) == false) {
        throw new exception.BadRequestException('닉네임 유효성 에러');
    }

    const ExisNickname = await userRepository.findByNickname(nickname);
    if (ExisNickname) {
        throw new exception.BadRequestException('닉네임 중복확인 실패');
    }

    return ExisNickname;
};

module.exports = {
    localSignUp,
    updateNicknameAgeGender,
    checkEmail,
    checkNickname
};
