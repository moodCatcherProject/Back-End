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
        throw new exception.BadRequestException('대댓글 내용 없음');
    }

    const comment = await commentRepository.findComment(commentId);
    if (comment === null) {
        throw new exception.NotFoundException('댓글 없음');
    }

    const findUser = await commentRepository.findUser(userId);
    const userNickname = findUser.nickname;
    const userGrade = findUser.grade;

    if (userNickname === null) {
        throw new exception.BadRequestException('nickname 없음');
    }

    if (userGrade === null) {
        throw new exception.BadRequestException('grade 없음');
    }

    const createdReComment = await reCommentRepository.createReComment(commentId, content, userId);

    await exception.MoodPoint.whenLeaveComment(
        userId,
        await commentRepository.findPostIdByCommentId(commentId)
    );
    await exception.MoodPoint.whenLeaveMyPostComment(
        userId,
        await commentRepository.findPostIdByCommentId(commentId)
    );
    await exception.MoodPoint.whenLeaveMyCommentOfRecomment(
        userId,
        await commentRepository.findPostIdByCommentId(commentId),
        commentId
    );
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
        throw new exception.BadRequestException('대댓글 내용 없음');
    }

    const reComment = await reCommentRepository.findReComment(recommentId);
    if (reComment === null) {
        throw new exception.NotFoundException('대댓글 없음');
    }

    const user = await reCommentRepository.findReComment(recommentId);
    const findUser = user.userId;
    if (findUser !== userId) {
        throw new exception.UnauthorizedException('대댓글의 작성자만 수정 가능합니다');
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
        throw new exception.NotFoundException('대댓글 없음');
    }

    const user = await reCommentRepository.findReComment(recommentId);
    const findUser = user.userId;
    if (findUser !== userId) {
        throw new exception.BadRequestException('대댓글의 작성자만 삭제 가능합니다');
    }

    const deleteReComment = await reCommentRepository.deleteReComment(recommentId, userId);

    return deleteReComment;
};

module.exports = {
    createReComment,
    updateReComment,
    deleteReComment
};
