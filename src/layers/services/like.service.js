const likeRepository = require('../repositories/like.repository');
const exception = require('../exceptModels/_.models.loader');

const pressLike = async (userId, postId) => {
    const likeStatus = await likeRepository.pressLike(userId, postId);

    return;
};

module.exports = { pressLike };
