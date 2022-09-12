const { Like } = require('../../sequelize/models');

/**
 * Like table에서 userId, PostId가 일치하는 data 반환
 * @param {number} userId
 * @param {number} postId
 * @returns { Promise<{ likeId:number, postId:number, userId:number, likeStatus:boolean, createdAt:date, updatedAt:date } | null>}
 */
const findLikeByUserIdAndPostId = async (userId, postId) => {
    return await Like.findOne({
        where: { userId, postId }
    });
};

/**
 * Like 테이블에 userId, postId, likeStatus:true인 data 생성 후 반환
 * @param {number} userId
 * @param {number} postId
 * @returns { Promise<{ likeId:number, postId:number, userId:number, likeStatus:boolean, createdAt:date, updatedAt:date } | null>}
 */
const registerLike = async (userId, postId) => {
    return await Like.create({
        userId,
        postId,
        likeStatus: true
    });
};

/**
 * Like table에서 userId, PostId가 일치하는 data의 likeStatus 수정 후 like data 반환
 * @param {number} userId
 * @param {number} postId
 * @param {boolean} likeStatus
 * @returns { Promise<{ likeId:number, postId:number, userId:number, likeStatus:boolean, createdAt:date, updatedAt:date } | null>}
 */
const updateLike = async (userId, postId, likeStatus) => {
    await Like.update({ likeStatus }, { where: { userId, postId } });

    return await findLikeByUserIdAndPostId(userId, postId);
};

module.exports = { findLikeByUserIdAndPostId, registerLike, updateLike };
