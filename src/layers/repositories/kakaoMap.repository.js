const { Auth } = require('../../sequelize/models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const exception = require('../exceptModels/_.models.loader');

/**
 * 해당 유저의 latitude, longitude, isExistsMap 값 반환
 * @param {number} userId
 * @returns { Promise<{ latitude: number, longitude: number, isExistsMap: boolean }> | null }
 */
const findUserPosition = async (userId) => {
    try {
        return await Auth.findOne({
            where: { authId: userId },
            attributes: ['latitude', 'longitude', 'isExistsMap'],
            raw: true
        });
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * 유저 좌표 업데이트
 * @param {number} userId
 * @param {number} latitude
 * @param {number} longitude
 * @returns
 */
const updatePosition = async (userId, latitude, longitude) => {
    try {
        await Auth.update(
            {
                latitude,
                longitude
            },
            {
                where: { authId: userId }
            }
        );

        return;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * @returns isExistsMap이 true인 유저 정보 배열 반환
 */
const findAroundCatcher = async () => {
    try {
        return await Auth.findAll({ raw: true, where: { isExistsMap: true } });
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 *
 * @param {number} userId
 * @param {boolean} isExistsMap
 * @returns { Promise<{ isExistsMap: boolean }> | null }
 */
const onOffMap = async (userId, isExistsMap) => {
    try {
        await Auth.update({ isExistsMap }, { where: { authId: userId } });
        const result = await Auth.findOne({
            where: { authId: userId },
            attributes: ['isExistsMap']
        });

        return result;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

module.exports = {
    findUserPosition,
    updatePosition,
    findAroundCatcher,
    onOffMap
};
