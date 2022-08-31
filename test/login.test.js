/**
 * @version 1.0 현재 실험 파일
 * @desc 로그인을 한 상태를 만들기 위한 테스트 코드
 */

const {isLoggedIn} = require("../src/layers/routes/middlewares/authMiddle")
const postController = require("../src/layers/controllers/post.controller")
 const app = require("../src/app")
 const { sequelize } = require("../src/sequelize/models")

 
 beforeAll(async () => {
   await sequelize.sync()
 })

 describe("게시물 작성 테스트", () => {
   
    
    
    req = {
        isAuthenticated: jest.fn(() => true),
        post:{
        title : "제목입니다",
        content : "내용입니다.",
        File : {location : "사진 경로"}
        },
        items:{
        brand : "나이키",
        name : "가나다 운동화",
        price : "13000원",
        imgUrl : "http/::"
        }
    }
    res = {
        status: jest.fn(() => res),
        send : jest.fn(),
    }
    next = jest.fn()
      
    
    
    test("로그인이 가능해야 함.", async() => {
       expect(postController.createPost(req, res)).toBe(200)

    })

 })
