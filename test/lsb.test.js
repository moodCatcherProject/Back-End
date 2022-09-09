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

describe('로그인 후 닉네임 나이 성별 추가', () => {
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
    // test('닉네임 나이 성별 추가 201 (성공)', (done) => {
    //     agent
    //         .post('/api/auth/detail')
    //         .send({
    //             nickname: 'Rph',
    //             age: '10대',
    //             gender: '여자'
    //         })
    //         .expect(201, done);
    // });
    // test('닉네임이 빈값일때 400 (실패)', (done) => {
    //     agent
    //         .post('/api/auth/detail')
    //         .send({
    //             nickname: '',
    //             age: '10대',
    //             gender: '여자'
    //         })
    //         .expect(400, done);
    // });
    // test('닉네임이 문자열이 아닐때 400 (실패)', (done) => {
    //     agent
    //         .post('/api/auth/detail')
    //         .send({
    //             nickname: 123,
    //             age: '10대',
    //             gender: '여자'
    //         })
    //         .expect(400, done);
    // });
    // test('닉네임 유효성이 맞지 않을때 (닉네임은 한글 대문자 소문자 허용 2~16글자) 400 (실패)', (done) => {
    //     agent
    //         .post('/api/auth/detail')
    //         .send({
    //             nickname: '1',
    //             age: '10대',
    //             gender: '여자'
    //         })
    //         .expect(400, done);
    // });
    // test('닉네임이 증복될때 400 (실패)', (done) => {
    //     agent
    //         .post('/api/auth/detail')
    //         .send({
    //             nickname: 'Rph',
    //             age: '10대',
    //             gender: '여자'
    //         })
    //         .expect(400, done);
    // });
    // test('나이가 빈값일때 400 (실패)', (done) => {
    //     agent
    //         .post('/api/auth/detail')
    //         .send({
    //             nickname: 'Rph',
    //             age: '',
    //             gender: '여자'
    //         })
    //         .expect(400, done);
    // });
    // test('나이가 문자열이 아닐때 400 (실패)', (done) => {
    //     agent
    //         .post('/api/auth/detail')
    //         .send({
    //             nickname: 'Rph',
    //             age: 123,
    //             gender: '여자'
    //         })
    //         .expect(400, done);
    // });
    // test('나이 유효성이 맞지 않을때 (나이는 "10대"or"20대"or"30대"or"40대"or"50대" 만 입력 가능) 400 (실패)', (done) => {
    //     agent
    //         .post('/api/auth/detail')
    //         .send({
    //             nickname: 'Rph',
    //             age: '60대',
    //             gender: '여자'
    //         })
    //         .expect(400, done);
    // });
    // test('성별이 빈값일때 400 (실패)', (done) => {
    //     agent
    //         .post('/api/auth/detail')
    //         .send({
    //             nickname: 'Rph',
    //             age: '10대',
    //             gender: ''
    //         })
    //         .expect(400, done);
    // });
    // test('성별이 문자열이 아닐때 400 (실패)', (done) => {
    //     agent
    //         .post('/api/auth/detail')
    //         .send({
    //             nickname: 'Rph',
    //             age: '10대',
    //             gender: 123
    //         })
    //         .expect(400, done);
    // });
    // test('성별 유효성이 맞지 않을때 (성별은 "남자" 또는 "여자" 만 입력 가능) 400 (실패)', (done) => {
    //     agent
    //         .post('/api/auth/detail')
    //         .send({
    //             nickname: 'Rph',
    //             age: '10대',
    //             gender: '중성'
    //         })
    //         .expect(400, done);
    // });
});

describe('로그인 전 닉네임 확인', () => {
    test('닉네임 중복확인 200 (성공)', (done) => {
        request(app).get(`/api/auth/checkNickname?nickname=${'Rph1'}`).expect(200, done);
    });
    test('닉네임이 빈값일때 400 (실패)', (done) => {
        request(app).get(`/api/auth/checkNickname?nickname=${''}`).expect(400, done);
    });
    test('닉네임 유효성이 맞지 않을때 (닉네임은 한글 대문자 소문자 허용 2~16글자) 400 (실패)', (done) => {
        request(app).get(`/api/auth/checkNickname?nickname=${'1'}`).expect(400, done);
    });
    test('닉네임이 증복될때 400 (실패)', (done) => {
        request(app).get(`/api/auth/checkNickname?nickname=${'Rph'}`).expect(400, done);
    });
});

describe('로그인 전 이메일 확인', () => {
    test('이메일 중복확인 200 (성공)', (done) => {
        request(app).get(`/api/auth/checkEmail?email=${'Rph2@gmail.com'}`).expect(200, done);
    });
    test('이메일이 빈값일때 400 (실패)', (done) => {
        request(app).get(`/api/auth/checkEmail?email=${''}`).expect(400, done);
    });
    test('이메일이 유효성이 맞지 않을때 400 (실패)', (done) => {
        request(app).get(`/api/auth/checkEmail?email=${'Rph3gmail.com'}`).expect(400, done);
    });
    test('이메일이 증복될때 400 (실패)', (done) => {
        request(app).get(`/api/auth/checkEmail?email=${'Rph1@gmail.com'}`).expect(400, done);
    });
});
// 게시글을 만들어줘야함
// 댓글 작성
// 댓글 수정
// 댓글 삭제
// describe('댓글 작성', () => {
//     test('댓글 작성 201 (성공)', (done) => {
//         agent
//             .post(`/api/comments?postId=${1}`)
//             .send({
//                 content: 'Rph content'
//             })
//             .expect(201, done);
//     });
//     test('댓글 내용이 빈칸일때 400 (성공)', (done) => {
//         agent
//             .post(`/api/comments?postId=${1}`)
//             .send({
//                 content: ''
//             })
//             .expect(400, done);
//     });
//     test('댓글을 작성하려는 게시글이 없을때 400 (성공)', (done) => {
//         agent
//             .post(`/api/comments?postId=${2}`)
//             .send({
//                 content: 'Rph content'
//             })
//             .expect(400, done);
//     });
// });
// describe('댓글 수정', () => {
//     test('댓글 수정 201 (성공)', (done) => {
//         agent
//             .put('/api/comments/:commentId')
//             .send({
//                 content: 'Rph content'
//             })
//             .expect(201, done);
//     });
//     test('댓글을 수정하려는 내용이 빈칸일때 400 (실패)', (done) => {
//         agent
//             .put('/api/comments/:commentId')
//             .send({
//                 content: ''
//             })
//             .expect(400, done);
//     });
//     test('댓글을 수정하려는 게시글이 없을때 400 (실패)', (done) => {
//         agent
//             .put('/api/comments/:commentId')
//             .send({
//                 content: 'Rph content'
//             })
//             .expect(400, done);
//     });
//     test('댓글을 수정하려는 댓글이 없을때 400 (실패)', (done) => {
//         agent
//             .put('/api/comments/:commentId')
//             .send({
//                 content: 'Rph content'
//             })
//             .expect(400, done);
//     });
// });
// describe('댓글 삭제', () => {
//     test('댓글 삭제 201 (성공)', (done) => {
//         agent.delete('/api/comments/:commentId').expect(201, done);
//     });
//     test('댓글을 삭제하려는 게시글이 없을때 400 (실패)', (done) => {
//         agent.post('/api/comments/:commentId').expect(400, done);
//     });
//     test('댓글을 삭제하려는 댓글이 없을때 400 (실패)', (done) => {
//         agent.post('/api/comments/:commentId').expect(400, done);
//     });
// });
// 게시글을 만들어줘야함
// 댓글을 만들어 줘야함
// 대댓글 작성
// 대댓글 수정
// 대댓글 삭제
describe('회원 탈퇴', () => {
    test('회원탈퇴 200 (성공)', (done) => {
        agent.delete('/api/user/signout').expect(200, done);
    });
});
