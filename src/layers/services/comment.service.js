const commentRepository = require('../repositories/comment.repository');
const postRepository = require('../repositories/post.repository');
const exception = require('../exceptModels/_.models.loader');

/**
 * 댓글 생성
 * @param { number } postId
 * @param { string } content
 * @param { number } userId
 * @returns { Promise<{ postId: number, content: string, userId: number }> | null }
 */
const createComment = async (postId, content, userId) => {
    if (!content) {
        throw new exception.BadRequestException('댓글 내용 없음.');
    }

    const findUser = await commentRepository.findUser(userId);
    const userNickname = findUser.nickname;
    const userGrade = findUser.grade;
    const userImgUrl = findUser.imgUrl;

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

    const createdComment = await commentRepository.createComment(postId, content, userId);
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
    data = getComments.map((e) => e.get({ plain: true }));
    // 게시물이 없을때

    return data.map((f) => {
        return {
            userId: f.userId,
            commentId: f.commentId,
            content: f.content,
            nickname: f.User.nickname,
            imgUrl: process.env.S3_STORAGE_URL + f.User.imgUrl,
            grade: f.User.grade,
            createdAt: f.createdAt,
            recommentId: f.Recomments.map((a) => {
                return {
                    userId: a.userId,
                    recommentId: a.recommentId,
                    content: a.content,
                    nickname: a.User.nickname,
                    imgUrl: process.env.S3_STORAGE_URL + a.User.imgUrl,
                    grade: a.User.grade,
                    createdAt: a.createdAt
                };
            })
        };
    });
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
        throw new exception.BadRequestException('댓글 없음.');
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
        throw new exception.BadRequestException('댓글 없음.');
    }

    const user = await commentRepository.findComment(commentId);
    const findUser = user.userId;
    if (findUser !== userId) {
        throw new exception.BadRequestException('댓글의 작성자만 삭제 가능합니다.');
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
