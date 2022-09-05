const { StartMessages } = require('../../sequelize/models');

const findStartMsg = async (req, res, next) => {
    const randomNum = await StartMessages.findAndCountAll({});
};
