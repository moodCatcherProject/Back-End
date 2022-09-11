const app = require('../src/app');
const { sequelize } = require('../src/sequelize/models');

const request = require('supertest');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});
let token;
const agent = request.agent(app);
describe('게시물 작성하기', () => {
    // let post = new FormData();

    // post.append('postImage', fs.readFileSync('test/testPicture.jpg'), 'postImage');
    // post.append('title', '테스트용 제목입니다.');
    // post.append('content', '테스트용 내용입니다.');
    // console.log(post);
    // let items = [
    //     {
    //         imgUrl: 'http://',
    //         brand: '나이키',
    //         name: '가나다 운동화',
    //         price: '79000원'
    //     }
    // ];

    //request.agent : 로그인 테스트를 한 뒤 다른 테스트를 진행하려면 로그인이
    // 풀려있게 되는데 이를 풀지 않고 저장하게 해주는 역할.

    //beforeEach 각 다음의 test모듈들이 실행될 때 이 테스트를 먼저 수행
    //각각의 테스트들을 실행하기 전!!

    test('로그인 안 했으면 로컬 회원가입 하기', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test@naver.com',
                password: '1234asdf!',
                confirmPw: '1234asdf!'
            })
            .expect(201, done);
    });
    test('agent 에 로그인 ', (done) => {
        agent
            .post('/api/auth/login')

            .send({
                email: 'test@naver.com',
                password: '1234asdf!'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                console.log(res.body, 'test@naver.com 로그인', token);
                done();
            });
    });

    test('agent 에 닉네임, 성별, 나이 추가', (done) => {
        agent
            .post('/api/auth/detail')
            .set('authorization', `Bearer ` + token)
            .send({
                nickname: '권영',
                gender: '남자',
                age: '20대'
            })
            .expect(201, done);
    });
    test('1번, 2번 게시물을 생성', (done) => {
        agent
            .post('/api/posts')
            .set('authorization', `Bearer ` + token)
            .send({
                post: {
                    title: '테스트용 제목입니다.',
                    content: '내용입니다. 테스트용!'
                },
                items: [
                    {
                        imgUrl: 'http://',
                        brand: '나이키',
                        name: '가나다 운동화',
                        price: '79000원'
                    },
                    {
                        imgUrl: 'http://',
                        brand: '아디다스',
                        name: '라마바 운동화',
                        price: '100000원'
                    }
                ]
            })
            .expect(201)
            .end((err, res) => {
                console.log(res.body);
                console.log(res.body.data.items);
                done();
            });
        agent
            .post('/api/posts')
            .set('authorization', `Bearer ` + token)
            .send({
                post: {
                    title: '이건 두번 째 글이고 삭제될 거에요!.',
                    content: '내용입니다. 테스트용!'
                },
                items: [
                    {
                        imgUrl: 'http://',
                        brand: '나이키',
                        name: '가나다 운동화',
                        price: '79000원'
                    },
                    {
                        imgUrl: 'http://',
                        brand: '아디다스',
                        name: '라마바 운동화',
                        price: '100000원'
                    }
                ]
            })
            .expect(201)
            .end((err, res) => {
                console.log(res.body);
                console.log(res.body.data.items);
                done();
            });
    });
});
describe(`로그인, 게시물 작성 알림이 있어야 함.`, () => {
    test('알림 불러오기', (done) => {
        agent
            .get('/api/notice')
            .set('authorization', `Bearer ` + token)
            .expect(200)
            .end((err, res) => {
                console.log(res.body.data);
                done();
            });
    });
});
