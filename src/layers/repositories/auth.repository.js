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
 
    createTable();
    const hashPW = await bcrypt.hash(password, 12);
    const auth = await Auth.create({
        email,
        password: hashPW,
        provider: "local",
    });
    return auth;
};


/**
 * @param { string } nickname @param { string } age
 * @returns User 테이블에 null이였던 nickname , age , gender 를 업데이트
 */
const createNicknameAgeGender = async (nickname, userId) => {
    // age gender 추가예정
    await User.update({ nickname }, { where: { userId } });
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
    createNicknameAgeGender,
};

// userId에서 nickname을 업데이트하고 userdetail에서 age,gender를 업데이트한다