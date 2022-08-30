/**
 * @version 1.0 현재 실험 파일
 * @desc 로그인을 한 상태를 만들기 위한 테스트 코드
 */

 const app = require("../app")
 const { sequelize } = require("../src/sequelize/models")
 const agent = request.agent(app)
 
 beforeAll(async () => {
     await sequelize.sync()
 })
