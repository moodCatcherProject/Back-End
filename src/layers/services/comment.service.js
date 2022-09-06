const commentRepository = require('../repositories/comment.repository');
const postRepository = require('../repositories/post.repository');
const exception = require('../exceptModels/_.models.loader');

/**
 * 댓글 생성
 * @param { number } postId
 * @param { string } content
 * @param { number } userId
 * @param { string } grade
 * @param { string } nickname
 * @returns { Promise<{ postId: number, content: string, userId: number, grade: string, nickname: string }> | null }
 */
const createComment = async (postId, content, userId, grade, nickname) => {
    if (!content) {
        throw new exception.BadRequestException('댓글 내용 없음.');
    }

    const findUser = await commentRepository.findUser(userId);
    const userNickname = findUser.nickname;
    const userGrade = findUser.grade;
    const userImgUrl = findUser.imgUrl;

    // if (userNickname === '' && userGrade === null && userImgUrl === null) {
    //     throw new exception.BadRequestException('없음.');
    // }

    if (userNickname === '') {
        throw new exception.BadRequestException('nickname 없음.');
    }

    if (userGrade === null) {
        throw new exception.BadRequestException('grade 없음.');
    }

    if (userImgUrl === null) {
        throw new exception.BadRequestException('imgUrl 없음.');
    }

    const post = await postRepository.findPost(postId);
    if (post === null) {
        throw new exception.BadRequestException('게시물 없음.');
    }

    const createdComment = await commentRepository.createComment(
        postId,
        content,
        userId,
        grade,
        nickname
    );

    return createdComment;
};

/**
 * 댓글 조회
 * @param { number } postId
 * @param { number } page
 * @param { number } count
 * @param { number } userId
 * @returns { Promise<{ postId: number, page: number, count: number, userId: number }> | null }
 */
const getComments = async (postId, page, count, userId) => {
    const getComments = await commentRepository.getComments(postId, page, count, userId);
    const findUserInfo = await commentRepository.findUserInfo(userId);
    console.log(findUserInfo);
    // 게시물이 없을때

    return getComments;
};

/**
 * 댓글 수정
 * @param { number } commentId
 * @param { string } content
 * @param { number } userId
 * @returns { Promise<{ commentId: number, content: string, userId: number }> | null }
 */
const updateComment = async (commentId, content, userId) => {
    if (!content) {
        throw new exception.BadRequestException('댓글 내용 없음.');
    }

    const findComment = await commentRepository.findComment(commentId);
    if (findComment === null) {
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
 * @returns { Promise<{ commentId: number, userId: number }> | null }
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
    getComments,
    updateComment,
    deleteComment
};
