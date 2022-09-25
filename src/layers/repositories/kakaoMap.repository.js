const { Auth } = require('../../sequelize/models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const findUserPosition = async (userId) => {
    return await Auth.findOne({
        where: { authId: userId },
        attributes: ['latitude', 'longitude'],
        raw: true
    });
};

const updatePosition = async (userId, latitude, longitude) => {
    await Auth.update(
        {
            latitude,
            longitude
        },
        {
            where: { authId: userId }
        }
    );
};

const findAroundCatcher = async () => {
    return await Auth.findAll({ raw: true });
};

module.exports = {
    findUserPosition,
    updatePosition,
    findAroundCatcher
};
