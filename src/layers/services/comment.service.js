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

    const post = await commentRepository.findPostByPostId(postId);
    if (post === null) {
        throw new exception.BadRequestException('게시물 없음.');
    }

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

    const post = await commentRepository.findUserIdByPostId(userId);
    if (!post) {
        throw new exception.BadRequestException('게시물 없음.');
    } // -> 테스트중 3번 postId를 못받음 못씀 어케해서 postId를 뽑아서 해야되나

    const comment = await commentRepository.findCommentByCommentId(commentId);
    if (comment === null) {
        throw new exception.BadRequestException('댓글이 없음.');
    }

    const user = await commentRepository.findUserIdByCommentId(userId);
    console.log(userId);
    if (user !== userId) {
        throw new exception.BadRequestException('댓글의 작성자만 수정 가능합니다.');
    } // -> 반 성공? 2번

    const updatedComment = await commentRepository.updateComment(userId, content, commentId);
    return updatedComment;
};

/**
 * @throws { Error } @param { number } userId @param { number } commentId
 * @returns { Promise<{ userId: number, commentId: number }> } commentId 삭제
 */
const deleteComment = async (userId, commentId) => {
    const A = await commentRepository.findA(userId);
    if (A) {
        throw new exception.BadRequestException('게시물 없음.');
    }

    const C = await commentRepository.findC(commentId);
    if (A) {
        throw new exception.BadRequestException('댓글이 없음.');
    }

    const B = await commentRepository.findB(userId);
    if (A) {
        throw new exception.BadRequestException('댓글의 작성자만 삭제 가능합니다.');
    }

    const deleteComment = await commentRepository.deleteComment(userId, commentId);
    return deleteComment;
};

module.exports = {
    createComment,
    updateComment,
    deleteComment
};
