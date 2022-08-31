const { Auth, User } = require("../../sequelize/models");
const bcrypt = require("bcrypt");

/**
 * @param { string } email
 * @returns Auth 테이블에서 email 한개를 찾음
 */
const findByEmail = async (email) => {
    const findByEmail = await Auth.findOne({ where: { email } });
    return findByEmail;
};
/**
 * @param { string } nickname
 * @returns User 테이블에서 nickname 한개를 찾음
 */
const findByNickname = async (nickname) => {
    const findByNickname = await User.findOne({ where: { nickname } });
    return findByNickname;
};
/**
 * @param { string } email @param { string } password
 * @returns Auth 테이블에 email, 해쉬password값 생성
 */
const createSignUp = async (email, password) => {
    const hash = await bcrypt.hash(password, 12);
    return await Auth.create({ email, password: hash, provider: "local" });
};
/**
 * @param { string } nickname @param { string } age
 * @returns User 테이블에 nickname , age 를 생성
 */
const createNicknameAge = async (nickname, age) => {
    await User.create({ where: { nickname, age } });
};

module.exports = {
    findByEmail,
    findByNickname,
    createSignUp,
    createNicknameAge,
};
