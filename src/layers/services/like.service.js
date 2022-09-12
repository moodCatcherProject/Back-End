const likeRepository = require('../repositories/like.repository');
const postRepository = require('../repositories/post.repository');
const exception = require('../exceptModels/_.models.loader');

/**
 * 좋아요 등록/취소
 * @param {number} userId
 * @param {number} postId
 * @returns 해당 게시글의 pressLike 함수 실행 전과 실행 후 likeCount의 배열
 */
const toggleLike = async (userId, postId) => {
    const isExistsPost = await postRepository.findPost(postId);
    if (!isExistsPost) throw new exception.NotFoundException('게시물이 없음');

    const isExistsLike = await likeRepository.findLikeByUserIdAndPostId(userId, postId);

    let likeStatus;
    let variation;
    let todayVariation;
    if (!isExistsLike) {
        await likeRepository.registerLike(userId, postId);
        variation = 1;
        todayVariation = 1;
        const likeCount = await postRepository.updateLikeCount(postId, variation, todayVariation);
        exception.MoodPoint.whenLeaveLike(userId, postId);

        return likeCount;
    } else {
        if (isExistsLike.likeStatus) {
            likeStatus = false;
            variation = -1;
            todayVariation = -1;
        } else {
            likeStatus = true;
            variation = 1;
            todayVariation = 1;
        }
        const likeData = await likeRepository.updateLike(userId, postId, likeStatus);

        if (
            likeData.createdAt.split(' ')[0] !== todayDate() ||
            likeData.updatedAt.split(' ')[0] !== todayDate()
        ) {
            todayVariation = 0;
        }

        const likeCount = await postRepository.updateLikeCount(postId, variation, todayVariation);
        return likeCount;
    }
};

/**
 * @returns 오늘 날짜를 'YYYY-MM-DDDD' 형태로 반환하는 함수
 */
function todayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const date = ('0' + today.getDate()).slice(-2);

    return year + '-' + month + '-' + date;
}

module.exports = { toggleLike };
