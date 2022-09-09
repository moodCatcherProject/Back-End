const { Like } = require('../../sequelize/models');
const { Op } = require('sequelize');

const findLikeByUserIdAndPostId = async (userId, postId) => {
    return await Like.findOne({
        where: { userId, postId }
    });
};

const findTodayLike = async () => {
    const todayLike = await Like.findAll({
        where: {
            likeStatus: true,
            createdAt: { [Op.gte]: Date.parse('2022-09-08') }
        },
        raw: true
    });

    console.log(todayLike);
    return;
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

module.exports = { findLikeByUserIdAndPostId, findTodayLike, registerLike, updateLike };
