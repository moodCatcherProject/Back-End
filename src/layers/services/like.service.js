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
    if (!isExistsLike) {
        await likeRepository.registerLike(userId, postId);
        const variation = 1;
        const likeCount = await postRepository.updateLikeCount(postId, variation);
        exception.MoodPoint.whenLeaveLike(userId, postId);
        return likeCount;
    } else {
        if (isExistsLike.likeStatus) {
            likeStatus = false;
            variation = -1;
        } else {
            likeStatus = true;
            variation = 1;
        }
        await likeRepository.updateLike(userId, postId, likeStatus);
        const likeCount = await postRepository.updateLikeCount(postId, variation);
        return likeCount;
    }
};

module.exports = { toggleLike };
