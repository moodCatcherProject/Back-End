const { User, Auth, UserDetail } = require('../../sequelize/models');
const bcrypt = require('bcrypt');

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
 * User 테이블에있는 nickname을 찾음.
 * @param { string } nickname
 * @returns { Promise<{ nickname: number }> | null> }
 */
const findByNickname = async (nickname) => {
    const findByNickname = await User.findOne({ where: { nickname } });
    return findByNickname;
};

/**
 * Auth 테이블에 email, 해쉬password 생성.
 * @param { string } email @param { string } password
 * @returns { Promise<{ email: string, password: string }> | null> }
 */
const createSignUp = async (email, password) => {
    const user = await User.create({});
    await UserDetail.create({});
    const hash = await bcrypt.hash(password, 12);
    const auth = await Auth.create({
        email,
        password: hash,
        provider: 'local'
    });
    return auth;
};

/**
 * User 테이블에 null이였던 nickname , age , gender 업데이트.
 * @param { string } nickname @param { string } age @param { string } gender
 * @returns { Promise<{ nickname: string, age: string, gender: string }> | null> }
 */
const updateNicknameAgeGender = async (nickname, age, gender, userId) => {
    await User.update({ nickname }, { where: { userId } });
    const findByDetailId = await User.findOne({
        include: [{ model: UserDetail, attributes: ['detailId'] }],
        where: { userId }
    });

    const detailId = findByDetailId.UserDetail.dataValues.detailId;
    await UserDetail.update({ age }, { where: { detailId } });
    await UserDetail.update({ gender }, { where: { detailId } });
};

module.exports = {
    findByEmail,
    findByNickname,
    createSignUp,
    updateNicknameAgeGender
};
