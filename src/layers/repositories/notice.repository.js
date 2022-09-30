const { Notice, UserDetail } = require('../../sequelize/models');
const exception = require('../exceptModels/_.models.loader');

/**
 *
 * @param {number} userId
 * @returns userId 유저의 모든 알림
 */
const findAllNotice = async (userId) => {
    try {
        return await Notice.findAll({
            where: { userId }
        });
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

const deleteOneNotice = async (noticeId) => {
    try {
        Notice.destroy({
            where: { noticeId }
        });
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * @desc userId 유저의 모든 알림 삭제
 * @param {number} userId
 */
const deleteAllNotice = async (userId) => {
    try {
        Notice.destroy({
            where: { userId }
        });
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * @desc userId 유저의 isExsitsNotice 를 true로 변경
 * @param {number} userId
 *
 */
const updateIsExsitsNotice = async (userId) => {
    try {
        UserDetail.update(
            {
                isExistsNotice: false
            },
            {
                where: { detailId: userId }
            }
        );
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

module.exports = {
    findAllNotice,
    deleteAllNotice,
    deleteOneNotice,

    updateIsExsitsNotice
};
