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

describe('회원가입 테스트', () => {
    test('로그인 안 했으면 로컬 회원가입 하기', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'sumin@sumin.com',
                password: 'sumin12*',
                confirmPw: 'sumin12*'
            })
            .expect(201, done);
    });
});

describe('로컬 로그인 테스트', () => {
    test('가입되지 않은 회원', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'suminERR@sumin.com',
                password: 'sumin12*'
            })
            .expect(404)
            .end((err, res) => {
                console.log(err);
                done();
            });
    });

    test('이메일이 빈 값일 때', () => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: '',
                password: 'sumin12*'
            })
            .expect(400, { message: 'credentials' });
    });
});
