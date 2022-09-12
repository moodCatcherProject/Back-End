const app = require('../src/app');
const { sequelize } = require('../src/sequelize/models');
const request = require('supertest');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

let token;
const agent = request.agent(app);

describe('회원가입 ', () => {
    test('1번 유저 회원가입 201 (성공)', (done) => {
        agent
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
    test('이메일 형식이 아닐때 400 (실패)', (done) => {
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
    test('1번 유저 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
});

describe('닉네임 나이 성별 추가', () => {
    test('닉네임이 빈값일때 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .set('authorization', `Bearer ` + token)
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
            .set('authorization', `Bearer ` + token)
            .send({
                nickname: 123,
                age: '10대',
                gender: '여자'
            })
            .expect(400, done);
    });
    test('닉네임 유효성이 맞지 않을때 (닉네임은 한글 대문자 소문자 허용 2~16글자) 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .set('authorization', `Bearer ` + token)
            .send({
                nickname: '1',
                age: '10대',
                gender: '여자'
            })
            .expect(400, done);
    });
    test('나이가 빈값일때 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .set('authorization', `Bearer ` + token)
            .send({
                nickname: 'Rph',
                age: '',
                gender: '여자'
            })
            .expect(400, done);
    });
    test('나이가 문자열이 아닐때 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .set('authorization', `Bearer ` + token)
            .send({
                nickname: 'Rph',
                age: 123,
                gender: '여자'
            })
            .expect(400, done);
    });
    test('나이 유효성이 맞지 않을때 (나이는 "10대"or"20대"or"30대"or"40대"or"50대" 만 입력 가능) 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .set('authorization', `Bearer ` + token)
            .send({
                nickname: 'Rph',
                age: '60대',
                gender: '여자'
            })
            .expect(400, done);
    });
    test('성별이 빈값일때 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .set('authorization', `Bearer ` + token)
            .send({
                nickname: 'Rph',
                age: '10대',
                gender: ''
            })
            .expect(400, done);
    });
    test('성별이 문자열이 아닐때 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .set('authorization', `Bearer ` + token)
            .send({
                nickname: 'Rph',
                age: '10대',
                gender: 123
            })
            .expect(400, done);
    });
    test('성별 유효성이 맞지 않을때 (성별은 "남자" 또는 "여자" 만 입력 가능) 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .set('authorization', `Bearer ` + token)
            .send({
                nickname: 'Rph',
                age: '10대',
                gender: '중성'
            })
            .expect(400, done);
    });
    test('1번 유저 닉네임 나이 성별 추가 201 (성공)', (done) => {
        agent
            .post('/api/auth/detail')
            .set('authorization', `Bearer ` + token)
            .send({
                nickname: 'Rph',
                age: '10대',
                gender: '여자'
            })
            .expect(201, done);
    });
    test('2번 유저 회원가입 201 (성공)', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({
                email: 'Rph2@gmail.com',
                password: 'Rph1543',
                confirmPw: 'Rph1543'
            })
            .expect(201, done);
    });
    test('2번 유저 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph2@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
    test('닉네임이 중복 될 때 400 (실패)', (done) => {
        agent
            .post('/api/auth/detail')
            .set('authorization', `Bearer ` + token)
            .send({
                nickname: 'Rph',
                age: '10대',
                gender: '여자'
            })
            .expect(400, done);
    });
});

describe('닉네임 확인', () => {
    test('닉네임 중복확인 200 (성공)', (done) => {
        agent
            .get(`/api/auth/checkNickname?nickname=${'Rph1'}`)
            .set('authorization', `Bearer ` + token)
            .expect(200, done);
    });
    test('닉네임이 빈값일때 400 (실패)', (done) => {
        agent
            .get(`/api/auth/checkNickname?nickname=${''}`)
            .set('authorization', `Bearer ` + token)
            .expect(400, done);
    });
    test('닉네임 유효성이 맞지 않을때 (닉네임은 한글 대문자 소문자 허용 2~16글자) 400 (실패)', (done) => {
        agent
            .get(`/api/auth/checkNickname?nickname=${'1'}`)
            .set('authorization', `Bearer ` + token)
            .expect(400, done);
    });
    test('닉네임이 증복될때 400 (실패)', (done) => {
        agent
            .get(`/api/auth/checkNickname?nickname=${'Rph'}`)
            .set('authorization', `Bearer ` + token)
            .expect(400, done);
    });
});

describe('이메일 확인', () => {
    test('이메일 중복확인 200 (성공)', (done) => {
        request(app).get(`/api/auth/checkEmail?email=${'Rph4@gmail.com'}`).expect(200, done);
    });
    test('이메일이 빈값일때 400 (실패)', (done) => {
        request(app).get(`/api/auth/checkEmail?email=${''}`).expect(400, done);
    });
    test('이메일이 유효성이 맞지 않을때 400 (실패)', (done) => {
        request(app).get(`/api/auth/checkEmail?email=${'Rph4gmail.com'}`).expect(400, done);
    });
    test('이메일이 증복될때 400 (실패)', (done) => {
        request(app).get(`/api/auth/checkEmail?email=${'Rph1@gmail.com'}`).expect(400, done);
    });
});

describe('댓글 작성', () => {
    test('1번 유저 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
    test('1번 유저 게시물 생성 201 (성공)', (done) => {
        agent
            .post('/api/posts')
            .set('authorization', `Bearer ` + token)
            .send({
                post: {
                    title: 'Rph title',
                    content: 'Rph content'
                },
                items: [
                    {
                        imgUrl: 'http://',
                        brand: 'Rph',
                        name: 'Rph',
                        price: 'Rph'
                    }
                ]
            })
            .expect(201)
            .end((err, res) => {
                done();
            });
    });
    test('1번 유저 댓글 작성 201 (성공)', (done) => {
        agent
            .post(`/api/comments?postId=${1}`)
            .set('authorization', `Bearer ` + token)
            .send({
                content: 'Rph content'
            })
            .expect(201, done);
    });
    test('댓글 내용이 빈칸일때 400 (실패)', (done) => {
        agent
            .post(`/api/comments?postId=${1}`)
            .set('authorization', `Bearer ` + token)
            .send({
                content: ''
            })
            .expect(400, done);
    });
    test('댓글을 작성하려는 게시글이 없을때 400 (실패)', (done) => {
        agent
            .post(`/api/comments?postId=${2}`)
            .set('authorization', `Bearer ` + token)
            .send({
                content: 'Rph content'
            })
            .expect(400, done);
    });
    test('2번 유저 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph2@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
    test('댓글 작성자가 nickname,imgUrl이 없을 때 400 (실패)', (done) => {
        agent
            .post(`/api/comments?postId=${1}`)
            .set('authorization', `Bearer ` + token)
            .send({
                content: 'Rph content'
            })
            .expect(400, done);
    });
});

describe('댓글 수정', () => {
    test('1번 유저 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
    test('1번 유저 댓글 수정 200 (성공)', (done) => {
        agent
            .put('/api/comments/1')
            .set('authorization', `Bearer ` + token)
            .send({
                content: 'Rph content update'
            })
            .expect(200, done);
    });
    test('댓글을 수정하려는 내용이 빈칸일때 400 (실패)', (done) => {
        agent
            .put('/api/comments/1')
            .set('authorization', `Bearer ` + token)
            .send({
                content: ''
            })
            .expect(400, done);
    });
    test('댓글을 수정하려는 댓글이 없을때 400 (실패)', (done) => {
        agent
            .put('/api/comments/2')
            .set('authorization', `Bearer ` + token)
            .send({
                content: 'Rph content update'
            })
            .expect(400, done);
    });
    test('2번 유저 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph2@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
    test('자신이 쓴 댓글이 아닌것을 수정하려고 할 때 400 (실패)', (done) => {
        agent
            .put('/api/comments/1')
            .set('authorization', `Bearer ` + token)
            .send({
                content: 'Rph content update'
            })
            .expect(400, done);
    });
});

describe('댓글 삭제', () => {
    test('자신이 쓴 댓글이 아닌것을 삭제하려고 할 때 400 (실패)', (done) => {
        agent
            .delete('/api/comments/1')
            .set('authorization', `Bearer ` + token)
            .expect(400, done);
    });
    test('1번 유저 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
    test('1번 유저 댓글 삭제 200 (성공)', (done) => {
        agent
            .delete('/api/comments/1')
            .set('authorization', `Bearer ` + token)
            .expect(200, done);
    });
    test('댓글을 삭제하려는 댓글이 없을때 400 (실패)', (done) => {
        agent
            .delete('/api/comments/1')
            .set('authorization', `Bearer ` + token)
            .expect(400, done);
    });
    test('2번유저로 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph2@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
});

describe('대댓글 작성', () => {
    test('1번 유저 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
    test('1번 유저 댓글 작성 201 (성공)', (done) => {
        agent
            .post(`/api/comments?postId=${1}`)
            .set('authorization', `Bearer ` + token)
            .send({
                content: 'Rph content'
            })
            .expect(201, done);
    });
    test('1번 유저 대댓글 작성 201 (성공)', (done) => {
        agent
            .post(`/api/recomments?commentId=${2}`)
            .set('authorization', `Bearer ` + token)
            .send({
                content: 'Rph re content'
            })
            .expect(201, done);
    });
    test('대댓글 내용이 빈칸일때 400 (실패) (실패)', (done) => {
        agent
            .post(`/api/recomments?commentId=${2}`)
            .set('authorization', `Bearer ` + token)
            .send({
                content: ''
            })
            .expect(400, done);
    });
    test('대댓글을 작성할 댓글이 없을 때 400 (실패)', (done) => {
        agent
            .post(`/api/recomments?commentId=${3}`)
            .set('authorization', `Bearer ` + token)
            .send({
                content: 'Rph re content'
            })
            .expect(400, done);
    });
    test('2번유저로 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph2@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
    test('대댓글의 작성자가 nickname,imgUrl이 없을 때 400 (실패)', (done) => {
        agent
            .post(`/api/recomments?commentId=${2}`)
            .set('authorization', `Bearer ` + token)
            .send({
                content: 'Rph re content'
            })
            .expect(400, done);
    });
});

describe('대댓글 수정', () => {
    test('1번 유저 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
    test('1번 유저 대댓글 수정 200 (성공)', (done) => {
        agent
            .put('/api/recomments/1')
            .set('authorization', `Bearer ` + token)
            .send({
                content: 'Rph content update'
            })
            .expect(200, done);
    });
    test('대댓글을 수정하려는 내용이 빈칸일때 400 (실패)', (done) => {
        agent
            .put('/api/recomments/1')
            .set('authorization', `Bearer ` + token)
            .send({
                content: ''
            })
            .expect(400, done);
    });
    test('대댓글을 수정하려는 대댓글이 없을때 400 (실패)', (done) => {
        agent
            .put('/api/recomments/2')
            .set('authorization', `Bearer ` + token)
            .send({
                content: 'Rph content update'
            })
            .expect(400, done);
    });
    test('2번유저로 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph2@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
    test('자신이 쓴 대댓글이 아닌것을 수정하려고 할 때 400 (실패)', (done) => {
        agent
            .put('/api/recomments/1')
            .set('authorization', `Bearer ` + token)
            .send({
                content: 'Rph content update'
            })
            .expect(400, done);
    });
});

describe('대댓글 삭제', () => {
    test('자신이 쓴 대댓글이 아닌것을 삭제하려고 할 때 400 (실패)', (done) => {
        agent
            .delete('/api/recomments/1')
            .set('authorization', `Bearer ` + token)
            .expect(400, done);
    });
    test('1번 유저 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph1@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
    test('1번 유저 대댓글 삭제 200 (성공)', (done) => {
        agent
            .delete('/api/recomments/1')
            .set('authorization', `Bearer ` + token)
            .expect(200, done);
    });
    test('대댓글을 삭제하려는 대댓글이 없을때 400 (실패)', (done) => {
        agent
            .delete('/api/recomments/1')
            .set('authorization', `Bearer ` + token)
            .expect(400, done);
    });
});

describe('회원 탈퇴', () => {
    test('회원탈퇴 200 (성공)', (done) => {
        agent
            .delete('/api/users/signout')
            .set('authorization', `Bearer ` + token)
            .expect(200, done);
    });
    test('2번유저로 로그인 200 (성공)', (done) => {
        agent
            .post('/api/auth/login')
            .send({
                email: 'Rph2@gmail.com',
                password: 'Rph1543'
            })
            .expect(200)
            .end((err, res) => {
                token = res.body.url.split('=')[2];
                done();
            });
    });
    test('회원탈퇴 200 (성공)', (done) => {
        agent
            .delete('/api/users/signout')
            .set('authorization', `Bearer ` + token)
            .expect(200, done);
    });
});
