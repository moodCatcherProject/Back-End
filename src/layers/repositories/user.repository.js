const { User } = require('../../sequelize/models');

/**
 *
 * @param {number} userId
 * @returns { Promise<{userId:number, nickname:number, provider:'local'|'kakao', email:string, password:string} | null>}
 */
const findUser = async (userId) => {
    return await User.findOne({
        where: { userId }
    });
};

const updateUserImage = async (userId, imageFileName) => {
    await User.update({ imgUrl: imageFileName }, { where: { userId } });

    return await findUser(userId);
};

const deleteUser = async (userId) => {
    await User.destroy({ where: { userId } });
};

module.exports = {
    findUser,
    updateUserImage,
    deleteUser
};
