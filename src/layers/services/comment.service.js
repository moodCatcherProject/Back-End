const commentRepository = require('../repositories/comment.repository');
const exception = require('../exceptModels/_.models.loader');

/**
 * @throws { Error } @param { number } userId @param { string } content @param { number } postId
 * @returns { Promise<{ userId: number, content: string, postId: number }> } postId, userId, content 생성
 */
const createComment = async (userId, content, postId) => {
    if (!content) {
        throw new exception.BadRequestException('댓글 내용 없음.');
    }

    // Posts에서 게시글을 findAll으로 찾아서 없는 게시글일때 에러처리

    const createdComment = await commentRepository.createComment(userId, content, postId);
    return createdComment;
};

/**
 * @throws { Error } @param { number } userId @param { string } content @param { number } commentId
 * @returns { Promise<{ userId: number, content: string, postId: number }> } postId, userId, content 업데이트
 */
const updateComment = async (userId, content, commentId) => {
    if (!content) {
        throw new exception.BadRequestException('댓글 내용 없음.');
    }

    // Posts에서 게시글을 findAll으로 찾아서 없는 게시글일때 에러처리
    // 본인이 쓴 글이 아닐때
    // 댓글이 없을때

    const updatedComment = await commentRepository.updateComment(userId, content, commentId);
    return updatedComment;
};

/**
 * @throws { Error } @param { number } userId @param { number } commentId
 * @returns
 */
const deleteComment = async (userId, commentId) => {
    // 본인이 쓴글이 아닐때
    // 삭제할 게시물이 없을때
    // 삭제할 댓글이 없을때

    const deleteComment = await commentRepository.deleteComment(userId, commentId);
    return deleteComment;
};

module.exports = {
    createComment,
    updateComment,
    deleteComment
};
