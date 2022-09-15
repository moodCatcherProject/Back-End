/**
 * @version 1.0
 * @desc 로컬 로그인, 유저 정보 관련 테스트 코드
 */
const app = require('../src/app');
const { sequelize } = require('../src/sequelize/models');
const request = require('supertest');
const agent = request.agent(app);

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

let token;
describe('회원가입 테스트', () => {
    test('1번 유저 로컬 회원가입 하기(성공)', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'sumin@sumin.com',
                password: 'sumin12*',
                confirmPw: 'sumin12*'
            })
            .expect(201, done);
    });

    test('2번 유저 로컬 회원가입 하기(성공)', (done) => {
        agent
            .post('/api/auth/signup')
            .send({
                email: 'sumin2@sumin.com',
                password: 'sumin12*',
                confirmPw: 'sumin12*'
            })
            .expect(201, done);
    });
});

describe('로컬 로그인 테스트', () => {
    test('2번 유저 로컬 로그인 하기(성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'sumin2@sumin.com',
                password: 'sumin12*'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                console.log(res.body, 'sumin@sumin.com 로그인', token);
                done();
            });
    });

    test('2번 유저 닉네임, 나이, 성별 추가(성공)', (done) => {
        agent
            .post('/api/auth/detail')
            .set('authorization', `Bearer ` + token)
            .send({
                nickname: '수민2',
                age: '20대',
                gender: '여자'
            })
            .expect(201, done);
    });

    test('1번 유저 로컬 로그인 하기(성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'sumin@sumin.com',
                password: 'sumin12*'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                console.log(res.body, 'sumin@sumin.com 로그인', token);
                done();
            });
    });

    test('1번 유저 닉네임, 나이, 성별 추가(성공)', (done) => {
        agent
            .post('/api/auth/detail')
            .set('authorization', `Bearer ` + token)
            .send({
                nickname: '수민1',
                age: '20대',
                gender: '여자'
            })
            .expect(201, done);
    });

    test('로그인 한 상태에서 로그인(실패)', (done) => {
        request(app)
            .post('/api/auth/login')
            .set('authorization', `Bearer ` + token)
            .send({
                email: 'suminERR@sumin.com',
                password: 'sumin12*'
            })
            .expect(404, done);
    });

    test('가입되지 않은 회원(실패)', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'suminERR@sumin.com',
                password: 'sumin12*'
            })
            .expect(404, done);
    });

    test('이메일이 빈 문자열일 때(실패)', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: '',
                password: 'sumin12*'
            })
            .expect(404, done);
    });

    test('이메일이 빈 값일 때(실패)', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                password: 'sumin12*'
            })
            .expect(404, done);
    });

    test('이메일이 string이 아닐 때(실패)', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 1234,
                password: 'sumin12*'
            })
            .expect(400, done);
    });

    test('비밀번호가 빈 문자열일 때(실패)', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'sumin@sumin.com',
                password: ''
            })
            .expect(404, done);
    });

    test('비밀번호가 빈 값일 때(실패)', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'sumin@sumin.com'
            })
            .expect(404, done);
    });

    test('비밀번호가 string이 아닐 때(실패)', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'sumin@sumin.com',
                password: 1234
            })
            .expect(400, done);
    });
});

describe('유저 정보 관련 테스트', () => {
    test('1번 유저 정보 조회하기(성공)', (done) => {
        agent
            .get('/api/users/1')
            .set('authorization', `Bearer ` + token)
            .expect(200, done);
    });

    test('비로그인 상태에서 1번 유저 정보 조회하기(실패)', (done) => {
        request(app).get('/api/users/1').expect(401, done);
    });

    test('존재하지 않는 유저 정보 조회하기(실패)', (done) => {
        request(app)
            .get('/api/users/3')
            .set('authorization', `Bearer ` + token)
            .expect(500, done);
    });

    test('1번 유저 정보 수정하기(성공)', (done) => {
        agent
            .put('/api/users')
            .query({ nickname: '주디', age: '10대', gender: '남자' })
            .set('authorization', `Bearer ` + token)
            .attach('userValue', 'test/testPicture.jpg')
            .expect(201, done);
    });

    // 확인 필요!!!!!!!!!!!!!!!!!!!
    // test('비로그인 상태로 1번 유저 정보 수정하기(실패)', (done) => {
    //     request(app)
    //         .put('/api/users')
    //         .query({ nickname: '주디', age: '10대', gender: '남자' })
    //         .attach('userValue', 'test/testPicture.jpg')
    //         .expect(401, done);
    // });

    test('사진 없이 1번 유저 정보 수정하기(실패)', (done) => {
        request(app)
            .put('/api/users')
            .query({ nickname: '주디', age: '10대', gender: '남자' })
            .set('authorization', `Bearer ` + token)
            .expect(400, done);
    });

    test('이미지 파일이 아닐 때 1번 유저 정보 수정하기(실패)', (done) => {
        request(app)
            .put('/api/users')
            .query({ nickname: '주디', age: '10대', gender: '남자' })
            .set('authorization', `Bearer ` + token)
            .attach('userValue', 'startMsg.txt')
            .expect(500, done);
    });

    test('닉네임 없이 1번 유저 정보 수정하기(실패)', (done) => {
        request(app)
            .put('/api/users')
            .query({ age: '10대', gender: '남자' })
            .set('authorization', `Bearer ` + token)
            .attach('userValue', 'test/testPicture.jpg')
            .expect(400, done);
    });

    test('중복된 닉네임으로 1번 유저 정보 수정하기(실패)', (done) => {
        request(app)
            .put('/api/users')
            .query({ nickname: '수민2', age: '10대', gender: '남자' })
            .set('authorization', `Bearer ` + token)
            .attach('userValue', 'test/testPicture.jpg')
            .expect(400, done);
    });

    test('나이 없이 1번 유저 정보 수정하기(실패)', (done) => {
        request(app)
            .put('/api/users')
            .query({ nickname: '주디', gender: '남자' })
            .set('authorization', `Bearer ` + token)
            .attach('userValue', 'test/testPicture.jpg')
            .expect(400, done);
    });

    test('틀린 나이 형식으로 1번 유저 정보 수정하기(실패)', (done) => {
        request(app)
            .put('/api/users')
            .query({ nickname: '주디', age: '1대', gender: '남자' })
            .set('authorization', `Bearer ` + token)
            .attach('userValue', 'test/testPicture.jpg')
            .expect(400, done);
    });

    test('성별 없이 1번 유저 정보 수정하기(실패)', (done) => {
        request(app)
            .put('/api/users')
            .query({ nickname: '주디', age: '10대' })
            .set('authorization', `Bearer ` + token)
            .attach('userValue', 'test/testPicture.jpg')
            .expect(400, done);
    });

    test('틀린 성별 형식으로 1번 유저 정보 수정하기(실패)', (done) => {
        request(app)
            .put('/api/users')
            .query({ nickname: '주디', age: '1대', gender: '곰돌이' })
            .set('authorization', `Bearer ` + token)
            .attach('userValue', 'test/testPicture.jpg')
            .expect(400, done);
    });

    test('1번 유저 아이콘 수정하기(성공)', (done) => {
        agent
            .patch('/api/users')
            .set('authorization', `Bearer ` + token)
            .send({
                profileIcon: 'moody'
            })
            .expect(201, done);
    });

    test('비로그인 상태에서 1번 유저 아이콘 수정하기(실패)', (done) => {
        request(app)
            .patch('/api/users')
            .send({
                profileIcon: 'moody'
            })
            .expect(401, done);
    });

    test('아이콘 빈 값으로 1번 유저 아이콘 수정하기(실패)', (done) => {
        agent
            .patch('/api/users')
            .set('authorization', `Bearer ` + token)
            .expect(400, done);
    });

    test('유효하지 않은 아이콘 값으로 1번 유저 아이콘 수정하기(실패)', (done) => {
        agent
            .patch('/api/users')
            .set('authorization', `Bearer ` + token)
            .send({
                profileIcon: 'woman'
            })
            .expect(400, done);
    });
});
