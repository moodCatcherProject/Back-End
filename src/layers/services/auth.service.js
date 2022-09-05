const authRepository = require('../repositories/auth.repository');
const exception = require('../exceptModels/_.models.loader');

// EM : 8자~ 30자
// PW : 영소대문자+숫자+특수문자 8자 ~ 20자
// NN : 한글, 영소 대문자. 숫자 2자~16자

// 비밀번호 비밀번호확인 이메일 닉네임 성별 나이 문자열 확인만 남음

/**
 * @throws { Error } @param { string } email @param { string } password @param { string } confirmPw
 * @returns { Promise<{ email: string, password: string }> } 이메일,비밀번호 생성
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
 * @throws { Error } @param { string } nickname @param {string} age
 * @returns { Promise<{ nickname: string, age: string }> } null이였던 nickname / age / gender 업데이트
 */
const updateNicknameAgeGender = async (nickname, age, gender, userId) => {
    new exception.isString({ nickname }).value;
    new exception.isString({ gender }).value;
    new exception.isString({ age }).value;

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

    const ExisNickname = await authRepository.findByNickname(nickname);
    if (ExisNickname) {
        throw new exception.BadRequestException('닉네임 중복확인 실패');
    }

    const updatedNicknameAgeGender = await authRepository.updateNicknameAgeGender(
        nickname,
        age,
        gender,
        userId
    );

    return updatedNicknameAgeGender;
};

/**
 * @throws { Error } @param { string } email
 * @returns { Promise<{ email: string }> }
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
 * @throws { Error } @param { string } nickname
 * @returns { Promise<{ nickname: string }> }
 */
const checkNickname = async (nickname) => {
    new exception.isString({ nickname }).value;

    const checkNickname = /^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{2,16}$/;
    if (checkNickname.test(nickname) == false) {
        throw new exception.BadRequestException('닉네임 유효성 에러');
    }

    const ExisNickname = await authRepository.findByNickname(nickname);
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
