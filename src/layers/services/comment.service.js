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

    if (userNickname === null) {
        throw new exception.BadRequestException('nickname 없음.');
    }

    if (userGrade === null) {
        throw new exception.BadRequestException('grade 없음.');
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

    const post = await postRepository.findPost(postId);
    if (post === null) {
        throw new exception.BadRequestException('게시물 없음.');
    }

    const createdAt = Date.now();
    console.log(createdAt);
    const createdAt2 = new Date();
    console.log(createdAt2);
    const createdAt3 = Date.parse(new Date());
    console.log(createdAt3);
    const created4 = new Date().getTime();
    console.log(created4);

    const displayedAt = (createdAt) => {
        const seconds = (Date.now() - Date.parse(createdAt)) / 1000;
        if (seconds < 60) return `방금 전`;
        const minutes = seconds / 60;
        if (minutes < 60) return `${Math.floor(minutes)}분 전`;
        const hours = minutes / 60;
        if (hours < 24) return `${Math.floor(hours)}시간 전`;
        const days = hours / 24;
        if (days < 7) return `${Math.floor(days)}일 전`;
        const weeks = days / 7;
        if (weeks < 5) return `${Math.floor(weeks)}주 전`;
        const months = days / 30;
        if (months < 12) return `${Math.floor(months)}개월 전`;
        const years = days / 365;
        return `${Math.floor(years)}년 전`;
    };

    for (let At of data) {
        At.createdAt = displayedAt(At.createdAt);
    }

    const result = data.map((f) => {
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
    return result;
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
