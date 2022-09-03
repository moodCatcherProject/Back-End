const { Comment, Post } = require('../../sequelize/models');

/**
 * @param { number } postId
 * @returns postId로 게시글 한개를 찾음
 */
const findPostByPostId = async (postId) => {
    const findpost = await Post.findOne({
        where: { postId },
        raw: true
    });
    return findpost;
};

const findCommentByCommentId = async (commentId) => {
    const findComment = await Comment.findOne({
        where: { commentId },
        raw: true
    });
    return findComment;
};

const findUserIdByCommentId = async (userId) => {
    const findComment = await Comment.findOne({
        where: { userId },
        raw: true
    });
    return findComment.userId;
};

const findUserIdByPostId = async (userId) => {
    const findPostId = await Post.findOne({
        userId
    });
    return findPostId;
}; // userId에서 postId를 찾아봐야 할것같은데?

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
 * @param { number } userId @param { string } content @param { number } commentId
 * @returns { Promise<{ userId: number, content: string, commentId: number }> } Comment테이블에 userId, content, postId 업데이트
 */
const updateComment = async (userId, content, commentId) => {
    const updatedComment = await Comment.update({ content }, { where: { commentId } });
    return updatedComment;
};

/**
 * @param { number } userId @param { string } commentId
 * @returns { Promise<{ userId: number, commentId: number }> } Comment테이블에 commentId를 삭제
 */
const deleteComment = async (userId, commentId) => {
    const deleteComment = await Comment.destroy({ where: { commentId } });
    return deleteComment;
};

module.exports = {
    findPostByPostId,
    findCommentByCommentId,
    findUserIdByPostId,
    findUserIdByCommentId,
    createComment,
    updateComment,
    deleteComment
};
