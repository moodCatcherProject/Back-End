const noticeRepository = require('../repositories/notice.repository');
const postRepository = require('../repositories/post.repository');
/**
 *
 * @param {number} userId
 * @returns userId 유저의 모든 알림 정보
 */
const findAllNotice = async (userId) => {
    const noticeData = await noticeRepository.findAllNotice(userId);

    noticeRepository.updateIsExsitsNotice(userId);
    return await Promise.all(
        noticeData.map(async (notice) => {
            let userId, imgUrl;
            if (notice.postId !== -1) {
                await postRepository.findPost(notice.postId).then((p) => {
                    imgUrl = p
                        ? process.env.S3_STORAGE_URL + p.imgUrl
                        : process.env.S3_STORAGE_URL + 'default.jpg';
                });
                userId = await postRepository.findPost(notice.postId);
            } else {
                imgUrl = process.env.S3_STORAGE_URL + 'default.jpg';
            }

            return {
                msg: notice.notice,
                userId: userId ? userId.userId : notice.userId,
                postId: notice.postId,
                imgUrl,
                createdAt: displayedAt(notice.createdAt),
                duplecation: notice.duplecation
            };
        })
    );
};

const displayedAt = (createdAt) => {
    const seconds = (Date.now() + 9 * 60 * 60 * 1000 - Date.parse(createdAt)) / 1000;
    if (seconds < 60) return `방금 전`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}분 전`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}시간 전`;
    else return `${createdAt.substring(0, 10)}`;
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
