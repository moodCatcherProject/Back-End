const { User, Auth, UserDetail, Hashauthnum } = require('../../sequelize/models');
const exception = require('../exceptModels/_.models.loader');
const bcrypt = require('bcrypt');

/**
 * Auth 테이블에서 email 값이 일치하는 data 반환
 * @param { string } email
 * @returns { Promise<{authId:number, sessionId:number, provider:'local'|'kakao', email:string, password:string} | null>}
 */
const findByEmail = async (email) => {
    try {
        const findByEmail = await Auth.findOne({ where: { email } });
        return findByEmail;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * Auth 테이블에 email, 해시password 생성.
 * @param { string } email
 * @param { string } password
 * @returns { Promise<{ email: string, password: string }> | null> }
 */
const createSignUp = async (email, password) => {
    try {
        await User.create({});
        await UserDetail.create({});

        const hash = await bcrypt.hash(password, 12);
        const auth = await Auth.create({
            email,
            password: hash,
            provider: 'local'
        });
        return auth;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * User 테이블에 null이였던 nickname , age , gender 업데이트.
 * @param { string } nickname
 * @param { string } age
 * @param { string } gender
 * @param { number } userId
 * @param { string } grade
 * @returns { Promise<{ nickname: string, age: string, gender: string, userId: number, grade: string }> | null> }
 */
const updateNicknameAgeGender = async (nickname, age, gender, userId, grade) => {
    try {
        await User.update({ nickname, grade }, { where: { userId } });
        const findByDetailId = await User.findOne({
            include: [{ model: UserDetail, attributes: ['detailId'] }],
            where: { userId }
        });

        const detailId = findByDetailId.UserDetail.dataValues.detailId;
        await UserDetail.update({ age, gender }, { where: { detailId } });
        return;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * Auth 테이블에 해당 email인 password를 해시화하고 업데이트.
 * @param { string } email
 * @param { string } password
 * @returns { Promise<{ email: string, password: string }> | null> }
 */
const updatePw = async (email, password) => {
    try {
        const hash = await bcrypt.hash(password, 12);
        await Auth.update({ password: hash }, { where: { email } });
        return;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * Auth 테이블에 해당 email에 null이였던 hashAuthNum을 업데이트.
 * @param { string } email
 * @param { string } hashAuthNum
 * @returns { Promise<{ email: string, hashAuthNum: string }> | null> }
 */
const createAuthNum = async (email, hashAuthNum) => {
    try {
        await Auth.update({ hashAuthNum }, { where: { email } });
        return;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * Auth 테이블에 해당 email의 hashAuthNum을 반환.
 * @param { string } email
 * @returns { Promise<{ email: string }> | null> }
 */
const findAuthNum = async (email) => {
    try {
        const findAuthNum = await Auth.findOne({ where: { email } });
        return findAuthNum.dataValues.hashAuthNum;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

const createDBNum = async (hashAuthNum) => {
    try {
        const createDBNum = await Hashauthnum.create({
            hashAuthNum
        });
        console.log(createDBNum, updateDBNum);
        return;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

module.exports = {
    findByEmail,
    createSignUp,
    updateNicknameAgeGender,
    updatePw,
    createAuthNum,
    findAuthNum,
    createDBNum
};
