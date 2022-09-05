const commentRepository = require('../repositories/comment.repository');
const postRepository = require('../repositories/post.repository');
const exception = require('../exceptModels/_.models.loader');

/**
 * 댓글 생성
 * @param { number } postId
 * @param { string } content
 * @param { number } userId
 * @returns { Promise<{ postId: number, content: string, userId: number }> }
 */
const createComment = async (postId, content, userId) => {
    if (!content) {
        throw new exception.BadRequestException('댓글 내용 없음.');
    }

    const post = await postRepository.findPost(postId);
    if (post === null) {
        throw new exception.BadRequestException('게시물 없음.');
    }

    const createdComment = await commentRepository.createComment(postId, content, userId);

    return createdComment;
};

/**
 * 댓글 수정
 * @param { number } commentId
 * @param { string } content
 * @param { number } userId
 * @returns { Promise<{ commentId: number, content: string, userId: number }> }
 */
const updateComment = async (commentId, content, userId) => {
    if (!content) {
        throw new exception.BadRequestException('댓글 내용 없음.');
    }

    const comment = await commentRepository.findComment(commentId);
    if (comment === null) {
        throw new exception.BadRequestException('댓글이 없음.');
    }

    const user = await commentRepository.findComment(commentId);
    const findUser = user.userId;
    if (findUser !== userId) {
        throw new exception.BadRequestException('댓글의 작성자만 수정 가능합니다.');
    }

    const updatedComment = await commentRepository.updateComment(commentId, content, userId);

    return updatedComment;
};

/**
 * 댓글 삭제
 * @param { number } commentId
 * @param { number } userId
 * @returns { Promise<{ commentId: number, userId: number }> }
 */
const deleteComment = async (commentId, userId) => {
    const comment = await commentRepository.findComment(commentId);
    if (comment === null) {
        throw new exception.BadRequestException('댓글이 없음.');
    }

    const user = await commentRepository.findComment(commentId);
    const findUser = user.userId;
    if (findUser !== userId) {
        throw new exception.BadRequestException('댓글의 작성자만 수정 가능합니다.');
    }

    const deleteComment = await commentRepository.deleteComment(commentId);

    return deleteComment;
};

module.exports = {
    createComment,
    updateComment,
    deleteComment
};
