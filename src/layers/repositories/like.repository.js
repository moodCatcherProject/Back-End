const { Post, Like } = require('../../sequelize/models');

const pressLike = async (userId, postId) => {
    await Like.create({
        userId,
        postId,
        likeStatus: true
    });
};
