const { Auth } = require('../../sequelize/models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const updatePosition = async (userId, latitude, longitude) => {
    return await Auth.update(
        {
            latitude,
            longitude
        },
        {
            where: { authId: userId }
        }
    );
};

const findAroundCatcher = async (userId, latitude, longitude, distance) => {
    return await Auth.findAll({ raw: true });
};

module.exports = {
    updatePosition,
    findAroundCatcher
};
