const { User, Auth, UserDetail, HashAuthNum } = require('../../sequelize/models');
const bcrypt = require('bcrypt');
const exception = require('../exceptModels/_.models.loader');

/**
 * Auth 테이블에서 email 값이 일치하는 data 반환
 * @param { string } email
 * @returns { Promise<{ authId:number, sessionId:number, provider:'local'|'kakao', email:string, password:string} | null>}
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
        await User.create({
            imgUrl: 'default.jpg'
        });
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
 * Hashauthnum 테이블에 해당 email의 hashAuthNum 생성.
 * @param { string } email
 * @param { string } hashAuthNum
 * @returns { Promise<{ email: string, hashAuthNum: string }> | null> }
 */
const signupCreateHashAuthNum = async (email, hashAuthNum) => {
    try {
        return await HashAuthNum.create({ email, hashAuthNum });
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * Hashauthnum 테이블에 해당 email의 hashAuthNum 업데이트.
 * @param { string } email
 * @param { string } hashAuthNum
 * @returns { Promise<{ email: string, hashAuthNum: string }> | null> }
 */
const updateHashAuthNum = async (email, hashAuthNum) => {
    try {
        return await HashAuthNum.update({ hashAuthNum }, { where: { email } });
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * Hashauthnum 테이블에 해당 email의 hashAuthNum 반환.
 * @param { string } email
 * @returns { Promise<{ email: string }> | null> }
 */
const findHashAuthNum = async (email) => {
    try {
        const findAllHashAuthNum = await HashAuthNum.findOne({
            where: { email },
            attributes: { exclude: ['email', 'authNumId'] },
            raw: true
        });
        return findAllHashAuthNum;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * Hashauthnum 테이블에서 해당 email data 삭제.
 * @param { string } email
 * @returns { Promise<{ email: string }> | null> }
 */
const deleteAuthNum = async (email) => {
    try {
        return await HashAuthNum.destroy({ where: { email } });
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

const logout = async (userId) => {
    await Auth.update({ refreshToken: null }, { where: { authId: userId } });

    return;
};

module.exports = {
    findByEmail,
    createSignUp,
    updateNicknameAgeGender,
    updatePw,
    signupCreateHashAuthNum,
    findHashAuthNum,
    updateHashAuthNum,
    findHashAuthNum,
    deleteAuthNum,
    logout
};
