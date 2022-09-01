const { User, Auth, UserDetail } = require("../../sequelize/models");
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
    const user = await User.create({});
    console.log(user.dataValues.userId);
    await UserDetail.create({});
    const hash = await bcrypt.hash(password, 12);
    const auth = await Auth.create({
        email,
        password: hash,
        provider: "local",
    });
    return auth;
};
/**
 * @param { string } nickname @param { string } age @param { string } gender
 * @returns User 테이블에 null이였던 nickname , age , gender 를 업데이트
 */
const updateNicknameAgeGender = async (nickname, age, gender, userId) => {
    await User.update({ nickname }, { where: { userId } });
    const findByDetailId = await User.findOne({
        include: [{ model: UserDetail, attributes: ["detailId"] }],
        where: { userId },
    });
    const detailId = findByDetailId.UserDetail.dataValues.detailId;

    await UserDetail.update({ age, gender }, { where: { detailId } });
};
const deleteUser = async (userId) => {
    await User.destroy({ where: { userId } });
};
//FUNCTION
const createTable = async () => {
    await User.create({});
    await UserDetail.create({});
};

module.exports = {
    findByEmail,
    findByNickname,
    createSignUp,
    updateNicknameAgeGender,
    deleteUser,
};

// userId에서 nickname을 업데이트하고 userdetail에서 age,gender를 업데이트한다
