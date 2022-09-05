const { Comment } = require('../../sequelize/models');

/**
 * Comment 테이블에 있는 commentId를 찾음.
 * @param { number } commentId
 * @returns { Promise<{ commentId: number }> | null }
 */
const findComment = async (commentId) => {
    const findComment = await Comment.findOne({
        where: { commentId }
    });

    return findComment;
};

/**
 * Comment 테이블에 postId, content, userId 생성.
 * @param { number } postId
 * @param { string } content
 * @param { number } userId
 * @returns { Promise<{ postId: number, content: string, userId: number }> | null }
 */
const createComment = async (postId, content, userId) => {
    const createdComment = await Comment.create({
        postId,
        content,
        userId
    });

    return createdComment;
};

/**
 *
 * @returns
 */
const getComments = async () => {
    const getComments = await Comment.findAll({});
    return getComments;
};

/**
 * Comment 테이블에 content 업데이트.
 * @param { number } commentId
 * @param { string } content
 * @returns { Promise<{ commentId: number, content: string }> | null }
 */
const updateComment = async (commentId, content) => {
    const updatedComment = await Comment.update({ content }, { where: { commentId } });

    return updatedComment;
};

/**
 * Comment 테이블에 commentId를 삭제.
 * @param { number } commentId
 * @returns { Promise<{ commentId: number }> | null }
 */
const deleteComment = async (commentId) => {
    const deleteComment = await Comment.destroy({ where: { commentId } });

    return deleteComment;
};

module.exports = {
    findComment,
    createComment,
    getComments,
    updateComment,
    deleteComment
};
