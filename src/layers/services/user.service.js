const userRepository = require('../repositories/user.repository');
const exception = require('../exceptModels/_.models.loader');

/**
 * @param { number } userId
 * @returns { Promise<{ userId: number }> }
 */
const deleteUser = async (userId) => {
    await userRepository.deleteUser(userId);
    return;
};

module.exports = {
    deleteUser
};
