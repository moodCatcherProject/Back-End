const { Comment, User, Post } = require('../../sequelize/models');

/**
 * Comment 테이블에 있는 commentId를 찾음.
 * @param { number } commentId
 * @returns { Promise<{ commentId: number }> | null }
 */
const findComment = async (commentId) => {
    const findComment = await Comment.findOne({
        where: { commentId }
    });
    return findComment;
};

/**
 * Comment 테이블에 postId, content, userId 생성.
 * @param { number } postId
 * @param { string } content
 * @param { number } userId
 * @returns { Promise<{ postId: number, content: string, userId: number }> | null }
 */
const createComment = async (postId, content, userId) => {
    const createdComment = await Comment.create({
        postId,
        content,
        userId
    });
    return createdComment;
};

/**
 * 설명
 * @param { number } page
 * @param { number } count
 * @returns { Promise<{ page: number, count: number }> | null }
 */
const getComments = async (postId, page, count) => {
    const getComments = await Comment.findAll({
        offset: count * (page - 1),
        limit: count,
        raw: true,
        include: [
            {
                model: Post,
                attributes: ['gender'],
                include: [
                    {
                        model: User,
                        attributes: ['nickname', 'imgUrl']
                    }
                ]
            }
        ],
        attributes: ['userId', 'commentId', 'content', 'createdAt']
    });
    console.log(getComments);

    return getComments;
};
// Commet table에 userId, commentId, content, createdAt이 있고 User table에 nickname, imgUrl이 있어서
// Commet에서 attributes로 userId, commentId, content, createdAt을빼서 보여주고,
// User에서 nickname, imgUrl, gender를 빼서 보여주려는데 Comment와 User가 연결되어있지 않아서 안됨.
// postId 1번에 있는 comment들만 보여줘야 하는데, 전부 보여주고있다.

/**
 * Comment 테이블에 content 업데이트.
 * @param { number } commentId
 * @param { string } content
 * @returns { Promise<{ commentId: number, content: string }> | null }
 */
const updateComment = async (commentId, content) => {
    const updatedComment = await Comment.update({ content }, { where: { commentId } });
    return updatedComment;
};

/**
 * Comment 테이블에 commentId를 삭제.
 * @param { number } commentId
 * @returns { Promise<{ commentId: number }> | null }
 */
const deleteComment = async (commentId) => {
    const deleteComment = await Comment.destroy({ where: { commentId } });
    return deleteComment;
};

module.exports = {
    findComment,
    createComment,
    getComments,
    updateComment,
    deleteComment
};
