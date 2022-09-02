/**
 * @version 1.0 현재 실험 파일
 * @desc 로그인을 한 상태를 만들기 위한 테스트 코드
 * @see https://inpa.tistory.com/entry/JEST-%F0%9F%93%9A-supertest-api-%EC%9A%94%EC%B2%AD%ED%85%8C%EC%8A%A4%ED%8A%B8#%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-request
 */
//app과 server를 분리한 이유 : app.listen을 테스트할 때 실행시켜버리면
//진짜 서버가 켜져버림!
const app = require("../src/app");
const { sequelize } = require("../src/sequelize/models");
// supertest: 통합테스트를 위한 모듈, 통합테스트 : 서버에 직접 요청을 보내보며 원하는 값이
// 오는지 확인
const request = require("supertest");

//테스트를 들어가기 전 beforeAll을 실행
// => 매번 테스트 DB를 새로 만들어 줘야 함.
beforeAll(async () => {
    await sequelize.sync({ force: true });
});
//describe : 테스트를 나눠주는 단위
describe("회원가입 테스트", () => {
    //request(app).메소드(URL).send(body에 보내줄 값).expect(statusCode, done)
    //
    test("로그인 안 했으면 로컬 회원가입 하기", (done) => {
        request(app)
            .post("/api/auth/signup")
            .send({
                email: "test@naver.com",
                password: "1234asdf!",
                confirmPw: "1234asdf!",
            })
            .expect(201, done);
    });
    test("password, confirmPw 가 다르면 회원가입 불가", (done) => {
        request(app)
            .post("/api/auth/signup")
            .send({
                email: "test@naver.com",
                password: "1234as!",
                confirmPw: "1234asdf!",
            })
            .expect(400, done);
    });
});

describe("로그인 테스트", () => {
    test("기존에 가입한 아이디로 로그인", (done) => {
        request(app)
            .post("/api/auth/login")
            .send({
                email: "test@naver.com",
                password: "1234asdf!",
            })
            .expect(200)
            .end((err, res) => {
                done();
            });
    });
    test("기존에 가입한 아이디가 아니라면 404에러", (done) => {
        request(app)
            .post("/api/auth/login")
            .send({
                email: "tes@naver.com",
                password: "1234asdf!",
            })
            .expect(404, done);
    });
    test("기존에 가입한 비밀번호가 아니라면 404에러", (done) => {
        request(app)
            .post("/api/auth/login")
            .send({
                email: "test@naver.com",
                password: "1234as!",
            })
            .expect(404, done);
    });
});

const FormData = require("form-data")
const fs = require("fs")
describe("게시물 작성하기", () => {
    let post = new FormData();
    
    
    post.append("postImage" , fs.readFileSync("test/testPicture.jpg"), "postImage" )
    post.append("title", "테스트용 제목입니다.")
    post.append("content", "테스트용 내용입니다.")
    console.log(post)
    let items =[{
      imgUrl : "http://",
      brand : "나이키",
      name : "가나다 운동화",
      price : "79000원"
    }]
    
    
    //request.agent : 로그인 테스트를 한 뒤 다른 테스트를 진행하려면 로그인이
    // 풀려있게 되는데 이를 풀지 않고 저장하게 해주는 역할.
    const agent = request.agent(app);
    //beforeEach 각 다음의 test모듈들이 실행될 때 이 테스트를 먼저 수행
    //각각의 테스트들을 실행하기 전!!
    test("agent 에 로그인 " , (done) => {
        agent
            .post("/api/auth/login")
            .send({
                email: "test@naver.com",
                password: "1234asdf!",
            })
            .expect(200)
            .end((err, res) => {
                console.log(res.body, "test@naver.com 로그인");
                done();
            });
    });
    test("agent 에 닉네임, 성별, 나이 추가", done => {
        agent
            .get(`/api/auth/checkNickname?nickname=${encodeURI("테스트 닉네임")}`)
            .
    })
    test("이미지를 뺀 게시물을 생성", (done) => {
        agent
            .post("/api/posts")
            .send({
                post : {
                    title : ""
                }
            })
    })
    
    
  

});
afterAll(async () => {});
