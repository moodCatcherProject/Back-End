/**
 * @version 1.0 현재 실험 파일
 * @desc 로그인을 한 상태를 만들기 위한 테스트 코드
 * @see https://inpa.tistory.com/entry/JEST-%F0%9F%93%9A-supertest-api-%EC%9A%94%EC%B2%AD%ED%85%8C%EC%8A%A4%ED%8A%B8#%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-request
 */
//app과 server를 분리한 이유 : app.listen을 테스트할 때 실행시켜버리면
//진짜 서버가 켜져버림!
const app = require('../src/app');
const { sequelize } = require('../src/sequelize/models');
// supertest: 통합테스트를 위한 모듈, 통합테스트 : 서버에 직접 요청을 보내보며 원하는 값이
// 오는지 확인
const request = require('supertest');
const agent = request.agent(app);
//테스트를 들어가기 전 beforeAll을 실행
// => 매번 테스트 DB를 새로 만들어 줘야 함.
beforeAll(async () => {
    await sequelize.sync({ force: true });
});
//describe : 테스트를 나눠주는 단위
describe('회원가입 테스트', () => {
    //request(app).메소드(URL).send(body에 보내줄 값).expect(statusCode, done)

    test('로그인 안 했으면 로컬 회원가입 하기', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test0@naver.com',
                password: '1234asdf!',
                confirmPw: '1234asdf!'
            })
            .expect(201, done);
    });
    test('로그인 안 했으면 로컬 회원가입 하기 2번유저', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test1@naver.com',
                password: '1234asdf!',
                confirmPw: '1234asdf!'
            })
            .expect(201, done);
    });
    test('password, confirmPw 가 다르면 회원가입 불가', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test0@naver.com',
                password: '1234as!',
                confirmPw: '1234asdf!'
            })
            .expect(400, done);
    });
});
let token;
describe('로그인 테스트', () => {
    test('기존에 가입한 아이디로 로그인', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'test0@naver.com',
                password: '1234asdf!'
            })
            .expect(200)
            .end((err, res) => {
                console.log(res.body.url.split('=')[2]);
                token = res.body.url.split('=')[2];
                done();
            });
    });
    test('기존에 가입한 아이디가 아니라면 404에러', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'tes0@naver.com',
                password: '1234asdf!'
            })
            .expect(404, done);
    });
    test('기존에 가입한 비밀번호가 아니라면 404에러', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'test0@naver.com',
                password: '1234as!'
            })
            .expect(404, done);
    });
});

describe('로그인 한 상태에서 회원가입, 로그인', () => {
    test('회원가입', (done) => {
        request(app)
            .post('/api/auth/signup')
            .set('authorization', `Bearer ` + token)
            .send({
                email: 'test0@naver.com',
                password: '1234asdf!',
                confirmPw: '1234asdf!'
            })
            .expect(404)
            .end((err, res) => {
                console.log(err, res.body);
                done();
            });
    });
    test('로그인', (done) => {
        request(app)
            .post('/api/auth/login')
            .set('authorization', `Bearer ` + token)
            .send({
                email: 'test0@naver.com',
                password: '1234asdf!',
                confirmPw: '1234asdf!'
            })
            .expect(404)
            .end((err, res) => {
                console.log(err, res.body);
                done();
            });
    });
});
