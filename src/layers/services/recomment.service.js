const reCommentRepository = require('../repositories/recomment.repository');
const commentRepository = require('../repositories/comment.repository');
const exception = require('../exceptModels/_.models.loader');
/**
 * 대댓글 생성
 * @param { number } commentId
 * @param { string } content
 * @param { number } userId
 * @returns { Promise<{ commentId: number, content: string, userId: number }> | null }
 */
const createReComment = async (commentId, content, userId) => {
    if (!content) {
        throw new exception.BadRequestException('대댓글 내용 없음.');
    }

    const comment = await commentRepository.findComment(commentId);
    if (comment === null) {
        throw new exception.BadRequestException('댓글이 없음.');
    }

    const createdReComment = await reCommentRepository.createReComment(commentId, content, userId);

    return createdReComment;
};

/**
 * 대댓글 수정
 * @param { number } recommentId
 * @param { string } content
 * @param { number } userId
 * @returns { Promise<{ recommentId: number, content: string, userId: number }> | null }
 */
const updateReComment = async (recommentId, content, userId) => {
    if (!content) {
        throw new exception.BadRequestException('대댓글 내용 없음.');
    }

    const reComment = await reCommentRepository.findReComment(recommentId);
    if (reComment === null) {
        throw new exception.BadRequestException('대댓글이 없음.');
    }

    const user = await reCommentRepository.findReComment(recommentId);
    const findUser = user.userId;
    if (findUser !== userId) {
        throw new exception.BadRequestException('대댓글의 작성자만 수정 가능합니다.');
    }

    const updatedReComment = await reCommentRepository.updateReComment(
        recommentId,
        content,
        userId
    );

    return updatedReComment;
};

/**
 * 대댓글 삭제
 * @param { number } recommentId
 * @param { number } userId
 * @returns { Promise<{ recommentId: number, userId: number }> | null }
 */
const deleteReComment = async (recommentId, userId) => {
    const reComment = await reCommentRepository.findReComment(recommentId);
    if (reComment === null) {
        throw new exception.BadRequestException('대댓글이 없음.');
    }

    const user = await reCommentRepository.findReComment(recommentId);
    const findUser = user.userId;
    if (findUser !== userId) {
        throw new exception.BadRequestException('대댓글의 작성자만 삭제 가능합니다.');
    }

    const deleteReComment = await reCommentRepository.deleteReComment(recommentId, userId);

    return deleteReComment;
};

module.exports = {
    createReComment,
    updateReComment,
    deleteReComment
};
