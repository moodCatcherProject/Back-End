const likeRepository = require('../repositories/like.repository');
const postRepository = require('../repositories/post.repository');
const exception = require('../exceptModels/_.models.loader');

/**
 * 좋아요 등록/취소
 * @param {number} userId
 * @param {number} postId
 * @returns 해당 게시글의 pressLike 함수 실행 전과 실행 후 likeCount의 배열
 */
const pressLike = async (userId, postId) => {
    const isExistsPost = await postRepository.findPost(postId);
    if (!isExistsPost) throw new exception.NotFoundException('게시물이 없음');

    const isExistsLike = await likeRepository.findLikeByUserIdAndPostId(userId, postId);

    if (!isExistsLike) {
        await likeRepository.registerLike(userId, postId);
        const likeCount = await postRepository.plusLikeCount(postId);

        return likeCount;
    } else {
        if (isExistsLike.likeStatus) {
            const likeStatus = false;
            await likeRepository.updateLike(userId, postId, likeStatus);
            const likeCount = await postRepository.minusLikeCount(postId);

            return likeCount;
        } else {
            const likeStatus = true;
            await likeRepository.updateLike(userId, postId, likeStatus);
            const likeCount = await postRepository.plusLikeCount(postId);

            return likeCount;
        }
    }
};

module.exports = { pressLike };
