const { User, Auth } = require("../../sequelize/models");
const bcrypt = require("bcrypt");

/**
 * Auth 테이블에서 email 값이 일치하는 data 반환
 * @param { string } email 
 * @returns { Promise<{authId:number, sessionId:number, provider:'local'|'kakao', email:string, password:string} | null>}
 */
const findByEmail = async (email) => {
    const auth = await Auth.findOne({ where: { email } });
    console.log(auth)

    return auth;
};

const createSignUp = async (email, nickname, password) => {
    const hash = await bcrypt.hash(password, 12);
    await User.Create({ email, nickname, password: hash });
};

module.exports = { findByEmail, createSignUp };
