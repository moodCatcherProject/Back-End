const { Notice, UserDetail } = require('../../sequelize/models');

/**
 *
 * @param {number} userId
 * @returns userId 유저의 모든 알림
 */
const findAllNotice = async (userId) => {
    return await Notice.findAll({
        where: { userId }
    });
};
/**
 * @desc userId 유저의 모든 알림 삭제
 * @param {number} userId
 */
const deleteAllNotice = async (userId) => {
    Notice.destroy({
        where: { userId }
    });
};

/**
 * @desc userId 유저의 isExsitsNotice 를 true로 변경
 * @param {number} userId
 *
 */
const updateIsExsitsNotice = async (userId) => {
    UserDetail.update(
        {
            isExistsNotice: false
        },
        {
            where: { detailId: userId }
        }
    );
};

module.exports = {
    findAllNotice,
    deleteAllNotice,

    updateIsExsitsNotice
};
