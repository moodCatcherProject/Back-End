const { User, Auth } = require("../../sequelize/models");
const bcrypt = require("bcrypt");

/**
 * Auth 테이블에서 email 값이 일치하는 data 반환
 * @param { string } email 
 * @returns { Promise<{authId:number, sessionId:number, provider:'local'|'kakao', email:string, password:string} | null>}
 */
const findByEmail = async (email) => {
    const findByEmail = await Auth.findOne({ where: { email } });
    
    return findByEmail;
};

/**
 *
 * @param { string } email @param { string } password
 * @returns User 테이블에 email, 해쉬password값 생성
 */
const createSignUp = async (email, password) => {
    const hash = await bcrypt.hash(password, 12);
    return await Auth.create({ email, password: hash, provider: "local" });

};

module.exports = { findByEmail, createSignUp };
