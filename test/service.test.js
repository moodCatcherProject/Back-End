const {crawlingMusinsa} = require("../services/searchService")
const express = require("express")
const request = require("supertest")

const app = require("../app")
const { sequelize } = require("../models")
const agent = request.agent(app)

beforeAll(async () => {
    await sequelize.sync()
})
describe("crawlingMusinga", () => {
    const keyword = "후드티";

    /**
         * 후드티로 검색
         */
    test("크롤링 완료 후 받는 90개(첫 페이지가 90개)", async() => {
        expect(await (await crawlingMusinsa(keyword)).length).toBe(90)
    } )
})


test("크롤링 완료 후 status 200", done => {
    /**
     * 밑의 get메소드와 링크로 요청을 보내보기. expect는 값을 예측하는 것. 첫 인자는 status 코드
     * expect(status: number, callback?: CallbackHandler): this;
        expect(status: number, body: any, callback?: CallbackHandler): this;
     */
request(app)
    .get(encodeURI("/api/search?keyword=후드티"))
    .expect(200 , done)
})

afterAll(async () => {
    await sequelize.sync({force : true})
})