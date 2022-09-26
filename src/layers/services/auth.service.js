const authRepository = require('../repositories/auth.repository');
const userRepository = require('../repositories/user.repository');
const exception = require('../exceptModels/_.models.loader');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// EM : 8자~ 30자 이메일형식
// PW : 영소 대문자 + 숫자 + 특수문자 8자 ~ 20자
// NN : 한글 영소 대문자 숫자 2자~16자

/**
 * 회원가입
 * @param { string } email
 * @param { string } password
 * @param { string } confirmPw
 * @param { string } hashauthnum
 * @param { string } authNum
 * @returns { Promise<{ email: string, password: string, confirmPw: string, authNum: string }> | null }
 */
const localSignUp = async (email, password, confirmPw, authNum) => {
    new exception.isString({ email }).value;
    new exception.isString({ password }).value;
    new exception.isString({ confirmPw }).value;
    new exception.isString({ authNum }).value;

    if (password !== confirmPw) {
        throw new exception.BadRequestException('비밀번호 에러');
    }

    const checkEmail =
        /^[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
    if (checkEmail.test(email) == false) {
        throw new exception.BadRequestException('이메일 유효성 에러');
    }

    const ExistUser = await authRepository.findByEmail(email);
    if (ExistUser) {
        throw new exception.BadRequestException('이메일 중복 확인 실패');
    }

    const hashAuthNum = await authRepository.findHashAuthNum(email);
    if (!hashAuthNum) {
        throw new exception.BadRequestException(
            '인증번호를 발급받지 않았거나 인증번호가 만료된 이메일'
        );
    }

    const isExistsAuthNum = await bcrypt.compare(authNum, hashAuthNum.hashAuthNum);
    if (!isExistsAuthNum) {
        throw new exception.BadRequestException('인증번호 확인 실패');
    }

    const SignUp = await authRepository.createSignUp(email, password);

    await authRepository.deleteAuthNum(email);
    // 회원가입을 축하한다는 포인트 지급, 알림
    exception.MoodPoint.whenSignUp(SignUp.authId);
    return;
};

/**
 * 인증번호 확인
 * @param { string } authNum
 * @param { string } email
 * @returns { Promise<{ authNum: string, email: string }> | null }
 */
const checkAuthNum = async (authNum, email) => {
    new exception.isString({ authNum }).value;
    new exception.isString({ email }).value;

    const hashAuthNum = await authRepository.findHashAuthNum(email);

    if (!hashAuthNum) {
        throw new exception.BadRequestException(
            '인증번호를 발급받지 않았거나 인증번호가 만료된 이메일'
        );
    }

    if (
        new Date().setMinutes(new Date().getMinutes() - 10) >=
        new Date(hashAuthNum.updatedAt).setHours(new Date(hashAuthNum.updatedAt).getHours() - 9)
    ) {
        throw new exception.BadRequestException('인증번호 만료');
    }

    const isExistsAuthNum = await bcrypt.compare(authNum, hashAuthNum.hashAuthNum);

    return isExistsAuthNum;
};

/**
 * 닉네임 나이 성별 추가
 * @param { string } nickname
 * @param { string } age
 * @param { string } gender
 * @param { number } userId
 * @returns { Promise<{ nickname: string, age: string, gender: string, userId: number }> | null }
 */
const updateNicknameAgeGender = async (nickname, age, gender, userId) => {
    new exception.isString({ nickname }).value;
    new exception.isString({ age }).value;
    new exception.isString({ gender }).value;

    const ExistUser = await userRepository.getUserStatusByUserId(userId);
    if (ExistUser.nickname)
        throw new exception.ForbiddenException('초기설정한 유저정보가 있습니다.');

    const checkNickname = /^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{2,16}$/;
    if (checkNickname.test(nickname) === false) {
        throw new exception.BadRequestException('닉네임 유효성 에러');
    }

    if (gender !== '남자' && gender !== '여자') {
        throw new exception.BadRequestException('성별 유효성 에러');
    }

    if (age !== '10대' && age !== '20대' && age !== '30대' && age !== '40대' && age !== '50대') {
        throw new exception.BadRequestException('나이 유효성 에러');
    }

    const ExistNickname = await userRepository.findByNickname(nickname);
    if (ExistNickname) {
        throw new exception.BadRequestException('닉네임 중복확인 실패');
    }

    let grade = 'man 1';
    if (gender === '여자') grade = 'woman 1';

    await authRepository.updateNicknameAgeGender(nickname, age, gender, userId, grade);

    return;
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
    if (checkEmail.test(email) === false) {
        throw new exception.BadRequestException('이메일 유효성 에러');
    }

    const ExistEmail = await authRepository.findByEmail(email);
    if (ExistEmail) {
        throw new exception.BadRequestException('이메일 중복확인 실패');
    }

    return ExistEmail;
};

/**
 * 인증번호 발송
 * @param { string } email
 * @param { string } type
 * @returns { Promise<{ email: string, type: string }> | null }
 */
const sendEmail = async (email, type) => {
    new exception.isString({ email }).value;
    new exception.isString({ type }).value;

    const checkEmail =
        /^[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
    if (checkEmail.test(email) === false) {
        throw new exception.BadRequestException('이메일 유효성 에러');
    }

    if (type === 'signup') {
        const ExistEmail = await authRepository.findByEmail(email);
        if (ExistEmail) {
            throw new exception.BadRequestException('이미 가입된 이메일');
        } // 회원가입을 하려고 하는데, 이 이메일로 이미 가입 되어 있을 때 에러
    }

    // 관리자 계정 정보
    const managerEmail = {
        host: 'smtp.gmail.com', // Gmail 서비스 사용 / (SMTP는 이메일 클라이언트와 메일 서버 간의 데이터 교환 프로세스)
        port: 587, // Gmail port 번호
        secure: false, // 다른 포트를 사용할 경우 false를 사용하고 465를 사용할때는 true로 사용
        auth: {
            user: process.env.NODEMAILER_USER, // 관리자 이메일
            pass: process.env.NODEMAILER_PASS // Gmail에서 설정해주는 관리자 비밀번호
        }
    };

    // 인증번호 발송을 위한 랜덤한 숫자 6글자를 생성 후 암호화
    const authNum = Math.random().toString().substr(2, 6);
    const hashAuthNum = await bcrypt.hash(authNum, 12);
    console.log(authNum); // 이거 주석 풀면 인증번호 확인 가능

    const signupMailOptions = {
        from: '"MoodCatcher" <process.env.NODEMAILER_USER>', // 보내는 사람의 메일 (관리자 이메일)
        to: email, // 받는 사람 메일 (req.body값에 들어가는 email)
        subject: 'MoodCatcher에 오신 것을 환영합니다.', // 메일 제목
        html: `
          <h1>MoodCatcher MoodCatcher에 오신 것을 환영합니다.</h1>
          <p>아래의 인증 번호를 입력하여 인증을 완료해주세요.</p>
          <p>개인정보 보호를 위해 인증번호는 10분 동안만 유효합니다.</p>
          <h2>${authNum}</h2>
      `
    };

    const passwordMailOptions = {
        from: '"MoodCatcher" <process.env.NODEMAILER_USER>', // 보내는 사람의 메일 (관리자 이메일)
        to: email, // 받는 사람 메일 (req.body값에 들어가는 email)
        subject: 'MoodCatcher 인증번호가 도착했습니다.', // 메일 제목
        html: `<h1>MoodCatcher 인증번호가 도착했습니다.</h1>
                <p>비밀번호 찾기를 위한 인증번호입니다.<p>
                <p>아래의 인증번호를 입력하여 인증을 완료해주세요.</p>
                <p>개인정보 보호를 위해 인증번호는 10분 동안만 유효합니다.</p>
                <h2>${authNum}</h2>`
    };

    // (메일 전송을 위한 SMTP 필요, 관리자급의 계정정보 필요)
    const send = async (data) => {
        nodemailer.createTransport(managerEmail).sendMail(data, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                // console.log(info);
                res.send(authNum);
                transporter.close();
            }
        });
    };
    if (type === 'signup') {
        send(signupMailOptions);
    } else if (type === 'password') {
        send(passwordMailOptions);
    } else {
        throw new exception.BadRequestException('type을 확인해주세요');
    }
    // body에 적은 email이 이미 인증번호값이 있는지 없는지 확인.
    const ExistHashAuthNum = await authRepository.findHashAuthNum(email);
    // body에 적은 email이 이미 인증번호값이 있을 때 그 값을 업데이트.
    if (ExistHashAuthNum) {
        await authRepository.updateHashAuthNum(email, hashAuthNum);
        return;
    }
    // body에 적은 email에 hashauthnum 생성
    await authRepository.signupCreateHashAuthNum(email, hashAuthNum);
    return;
};

/**
 * 비밀번호 변경
 * @param { string } email
 * @param { string } password
 * @param { string } confirmPw
 * @param { string } authNum
 * @returns { Promise<{ email: string, password: string, confirmPw: string, authNum: string }> | null }
 */
const updatePw = async (email, password, confirmPw, authNum) => {
    new exception.isString({ email }).value;
    new exception.isString({ password }).value;
    new exception.isString({ confirmPw }).value;
    new exception.isString({ authNum }).value;

    const checkEmail =
        /^[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
    if (checkEmail.test(email) === false) {
        throw new exception.BadRequestException('이메일 유효성 에러');
    }

    const ExisEmail = await authRepository.findByEmail(email);
    if (!ExisEmail) {
        throw new exception.BadRequestException('존재하지 않는 이메일');
    }

    if (password !== confirmPw) {
        throw new exception.BadRequestException('비밀번호 에러');
    }

    const hashAuthNum = await authRepository.findHashAuthNum(email);
    if (!hashAuthNum) {
        throw new exception.BadRequestException('인증번호를 발급받지 않은 이메일');
    }

    const isExistsAuthNum = await bcrypt.compare(authNum, hashAuthNum.hashAuthNum);
    if (!isExistsAuthNum) {
        throw new exception.BadRequestException('인증번호 확인 실패');
    }

    await authRepository.updatePw(email, password);

    await authRepository.deleteAuthNum(email);

    return;
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
    checkAuthNum,
    updateNicknameAgeGender,
    checkEmail,
    sendEmail,
    updatePw,
    checkNickname
};
