const { User } = require('../../sequelize/models');

/**
 * User 테이블에서 userId 값이 일치하는 data 반환
 * @param {number} userId
 * @returns { Promise<{userId:number, nickname:string, imgUrl:string, grade:string} | null>}
 */
const findUser = async (userId) => {
    return await User.findOne({
        where: { userId }
    });
};

/**
 * User 테이블에서 userId 값이 일치하는 data의 imgUrl 업데이트 후 user data 반환
 * @param {number} userId
 * @param {string} imageFileName
 * @returns { Promise<{userId:number, nickname:string, imgUrl:string, grade:string} | null>}
 */
const updateUserImage = async (userId, imageFileName) => {
    await User.update({ imgUrl: imageFileName }, { where: { userId } });

    return await findUser(userId);
};

/**
 * User 테이블에서 userId 값이 일치하는 data 삭제
 * @param {number} userId
 */
const deleteUser = async (userId) => {
    await User.destroy({ where: { userId } });
};

module.exports = {
    findUser,
    updateUserImage,
    deleteUser
};
