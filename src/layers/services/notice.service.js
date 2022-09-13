const noticeRepository = require('../repositories/notice.repository');

/**
 *
 * @param {number} userId
 * @returns userId 유저의 모든 알림 정보
 */
const findAllNotice = async (userId) => {
    const noticeData = await noticeRepository.findAllNotice(userId);
    noticeRepository.updateIsExsitsNotice(userId);
    return {
        notices: noticeData.map((notice) => {
            return {
                msg: notice.notice,
                userId: notice.userId,
                postId: notice.postId,
                duplecation: notice.duplecation
            };
        })
    };
};

/**
 * @desc userId의 모든 알림 삭제
 * @param {number} userId
 */
const deleteAllNotice = async (userId) => {
    noticeRepository.deleteAllNotice(userId);
};

module.exports = {
    findAllNotice,
    deleteAllNotice
};
