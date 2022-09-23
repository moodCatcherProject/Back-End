const { Comment, User, Recomment } = require('../../sequelize/models');

/**
 * Comment 테이블에 있는 commentId를 찾음.
 * @param { number } commentId
 * @returns { Promise<{ commentId: number }> | null }
 */
const findComment = async (commentId) => {
    try {
        const findComment = await Comment.findOne({
            where: { commentId }
        });
        return findComment;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * User 테이블에있는 userId를 찾음.
 * @param { number } userId
 * @returns { Promise<{ userId: number }> | null }
 */
const findUser = async (userId) => {
    try {
        const findUser = await User.findOne({
            where: { userId }
        });
        return findUser;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * Comment 테이블에 postId, content, userId 생성.
 * @param { number } postId
 * @param { string } content
 * @param { number } userId
 * @returns { Promise<{ postId: number, content: string, userId: number }> | null }
 */
const createComment = async (postId, content, userId) => {
    try {
        const createdComment = await Comment.create({
            postId,
            content,
            userId
        });
        return createdComment;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * 유저정보를 포함한 댓글과 유저정보를 포함한 대댓글을 조회.
 * 댓글은 최신순으로 대댓글은 오래된순으로 조회.
 * @param { number } postId
 * @param { number } page
 * @param { number } count
 * @returns { Promise<{ postId: number, page: number, count: number }> | null }
 */

const getComments = async (postId, page, count) => {
    try {
        const getComments = await Comment.findAll({
            where: { postId },
            offset: count * (page - 1),
            limit: count,
            attributes: ['userId', 'commentId', 'content', 'createdAt'],
            order: [
                ['createdAt', 'DESC'],
                [Recomment, 'createdAt', 'ASC']
            ],
            include: [
                {
                    model: User,
                    attributes: ['nickname', 'imgUrl', 'grade']
                },
                {
                    model: Recomment,
                    attributes: ['userId', 'recommentId', 'content', 'createdAt'],
                    include: [
                        {
                            model: User,
                            attributes: ['nickname', 'imgUrl', 'grade']
                        }
                    ]
                }
            ]
        });
        return getComments;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * Comment 테이블에 content 업데이트.
 * @param { number } commentId
 * @param { string } content
 * @returns { Promise<{ commentId: number, content: string }> | null }
 */
const updateComment = async (commentId, content) => {
    try {
        await Comment.update({ content }, { where: { commentId } });
        return await Comment.findOne({ where: { commentId } });
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * Comment 테이블에 commentId를 삭제.
 * @param { number } commentId
 * @returns { Promise<{ commentId: number }> | null }
 */
const deleteComment = async (commentId) => {
    try {
        const deleteComment = await Comment.destroy({ where: { commentId } });
        return deleteComment;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

const findPostIdByCommentId = async (commentId) => {
    try {
        const postIdData = await Comment.findOne({
            where: { commentId },
            raw: true,
            attributes: ['postId']
        });
        return postIdData.postId;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};
module.exports = {
    findComment,
    findUser,
    createComment,
    getComments,
    updateComment,
    deleteComment,
    findPostIdByCommentId
};
