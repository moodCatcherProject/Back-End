const { Post, Like } = require('../../sequelize/models');

const findLikeByUserIdAndPostId = async (userId, postId) => {
    return await Like.findOne({
        where: { userId, postId }
    });
};

const registerLike = async (userId, postId) => {
    const like = await Like.create({
        userId,
        postId,
        likeStatus: true
    });

    return like.likeStatus;
};

const updateLike = async (userId, postId, likeStatus) => {
    await Like.update({ likeStatus }, { where: { userId, postId } });

    return await findLikeByUserIdAndPostId(userId, postId);
};

module.exports = { registerLike, findLikeByUserIdAndPostId, updateLike };
