const app = require('../src/app');
const { sequelize } = require('../src/sequelize/models');
const request = require('supertest');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

describe('회원가입 ', () => {
    test('회원가입 201 (성공)', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph1543',
                confirmPw: 'Rph1543'
            })
            .expect(201, done);
    });
    test('이메일이 빈값일때 400 (실패)', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: '',
                password: 'Rph1543',
                confirmPw: 'Rph1543'
            })
            .expect(400, done);
    });
    test('이메일이 문자열이 아닐때 400 (실패)', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 123,
                password: 'Rph1543',
                confirmPw: 'Rph1543'
            })
            .expect(400, done);
    });
    test('이메일 형식이 아닐때 (실패)', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'Rph1gmail',
                password: 'Rph1543',
                confirmPw: 'Rph1543'
            })
            .expect(400, done);
    });
    test('이메일이 중복될때 400 (실패)', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph1543',
                confirmPw: 'Rph1543'
            })
            .expect(400, done);
    });
    test('비밀번호가 빈값일때 400 (실패)', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'Rph1@gmail.com',
                password: '',
                confirmPw: 'Rph1543'
            })
            .expect(400, done);
    });
    test('비밀번호확인이 빈값일때 400 (실패)', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph1543',
                confirmPw: ''
            })
            .expect(400, done);
    });
    test('비밀번호가 문자열이 아닐때 400 (실패)', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'Rph1@gmail.com',
                password: 123,
                confirmPw: 'Rph1543'
            })
            .expect(400, done);
    });
    test('비밀번호확인이 문자열이 아닐때 400 (실패)', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph1543',
                confirmPw: 123
            })
            .expect(400, done);
    });
    test('비밀번호와 비밀번호 확인란이 일치하지 않을때 400 (실패)', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph15431',
                confirmPw: 'Rph1543'
            })
            .expect(400, done);
    });
    test('로그인 200 (성공)', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                done();
            });
    });
});

const agent = request.agent(app);

describe('로그인 후 닉네임 나이 성별 추가 ', () => {
    test('로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                done();
            });
    });
    test('닉네임 나이 성별 추가 201 (성공)', (done) => {
        agent
            .post('/api/auth/detail')
            .send({
                nickname: 'rph',
                age: '10대',
                gender: '여자'
            })
            .expect(201, done);
    });
    test('닉네임이 빈값일때 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .send({
                nickname: '',
                age: '10대',
                gender: '여자'
            })
            .expect(400, done);
    });
    test('닉네임이 문자열이 아닐때 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .send({
                nickname: 123,
                age: '10대',
                gender: '여자'
            })
            .expect(400, done);
    });
    test('나이가 빈값일때 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .send({
                nickname: 'rph',
                age: '',
                gender: '여자'
            })
            .expect(400, done);
    });
    test('나이가 문자열이 아닐때 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .send({
                nickname: 'rph',
                age: 123,
                gender: '여자'
            })
            .expect(400, done);
    });
    test('성별이 빈값일때 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .send({
                nickname: 'rph',
                age: '10대',
                gender: ''
            })
            .expect(400, done);
    });
    test('성별이 문자열이 아닐때 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .send({
                nickname: 'rph',
                age: '10대',
                gender: 123
            })
            .expect(400, done);
    });
});
// 닉네임 / 성별 / 나이 / 유효성 / 닉네임중복확인 / 이메일형식 / 이메일중복 / 닉네힘형식 / 닉네임중복 남음
