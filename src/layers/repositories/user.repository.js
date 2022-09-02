const { User } = require('../../sequelize/models');

const deleteUser = async (userId) => {
    await User.destroy({ where: { userId } });
};

module.exports = {
    deleteUser
};
