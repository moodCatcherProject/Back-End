const nodemailer = require('nodemailer');
// 관리자 계정 정보
const managerEmail = {
    host: 'smtp.gmail.com', // Gmail 서비스 사용
    port: 587, // Gmail port 번호?
    secure: false,
    auth: {
        user: 'lsb31431543@gmail.com', // 관리자 이메일                     process.env.NODEMAILER_USER 로 숨겨줘야함 .env  연결
        pass: 'ndebydkxljqrggzi' // Gmail에서 설정해주는 관리자 비밀번호     process.env.NODEMAILER_PASS로 숨겨줘야함 .env 연결
    }
};

// 인증번호를 위한 랜덤한 숫자 6글자를 생성
const authNum = Math.random().toString().substr(2, 6);

const mailOptions = {
    from: 'lsb31431543@gmail.com', // 보내는 사람의 메일
    to: 'dltnqja9@naver.com', // 받는 사람 메일 (req.body)
    subject: 'MoodCatcher 회원가입에 성공하셨습니다.', // 메일 제목
    html: `<h1>MoodCatcher 회원가입을 축하드립니다.</h1>
            <p>회원가입을 위한 인증번호 입니다.<p>
            <p>아래의 인증 번호를 입력하여 인증을 완료해주세요.</p>
            <h2>${authNum}</h2>` // 메일내용 (html으로 잘 꾸며서 할 수 있음)
};

// (메일 전송을 위한 smtp 필요, 관리자급의 계정정보 필요)
const send = async (data) => {
    nodemailer.createTransport(managerEmail).sendMail(data, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log(info);
            return info.response;
        }
    });
};

send(mailOptions);
