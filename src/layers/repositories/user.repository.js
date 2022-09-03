const { User } = require('../../sequelize/models');

/**
 * @param { number } userId
 * @returns userId를 삭제
 */
const deleteUser = async (userId) => {
    await User.destroy({ where: { userId } });
};

module.exports = {
    deleteUser
};
