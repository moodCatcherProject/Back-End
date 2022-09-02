const userRepository = require('../repositories/user.repository');
const exception = require('../exceptModels/_.models.loader');

const deleteUser = async (userId) => {
    await userRepository.deleteUser(userId);
    return;
};

module.exports = {
    deleteUser
};
