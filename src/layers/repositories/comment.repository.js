const { Comment } = require('../../sequelize/models');

/**
 * @param { number } userId @param { string } content @param { number } postId
 * @returns { Promise<{ userId: number, content: string, postId: number }> } Comment테이블에 userId, content, postId 생성
 */
const createComment = async (userId, content, postId) => {
    const createdComment = await Comment.create({
        userId,
        content,
        postId
    });
    return createdComment;
};

/**
 *
 * @param { number } userId @param { string } content @param { number } commentId
 * @returns { Promise<{ userId: number, content: string, commentId: number }> } Comment테이블에 userId, content, postId 업데이트
 */
const updateComment = async (userId, content, commentId) => {
    const updatedComment = await Comment.update({ content }, { where: { commentId } });
    return updatedComment;
};

/**
 *
 * @param { number } userId @param { string } commentId
 * @returns { Promise<{ userId: number, commentId: number }> } Comment테이블에 commentId를 삭제
 */
const deleteComment = async (userId, commentId) => {
    const deleteComment = await Comment.destroy({ where: { commentId } });
    return deleteComment;
};

module.exports = {
    createComment,
    updateComment,
    deleteComment
};
