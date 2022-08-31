const { Auth } = require("../../sequelize/models");
const bcrypt = require("bcrypt");

/**
 *
 * @param { string } email
 * @returns User 테이블에서 email한개를 찾음
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
