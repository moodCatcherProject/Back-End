const { Recomment } = require('../../sequelize/models');
const exception = require('../exceptModels/_.models.loader');

/**
 * Recomment에있는 recommentId를 찾음.
 * @param { string } recommentId
 * @returns { Promise<{ recommentId: number }> | null }
 */
const findReComment = async (recommentId) => {
    try {
        const findReComment = await Recomment.findOne({
            where: { recommentId }
        });
        return findReComment;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * Recomment 테이블에 commentId, content, userId 생성.
 * @param { number } commentId
 * @param { string } content
 * @param { number } userId
 * @returns { Promise<{ commentId: number, content: string, userId: number }> | null }
 */
const createReComment = async (commentId, content, userId) => {
    try {
        const createdComment = await Recomment.create({
            commentId,
            content,
            userId
        });
        return createdComment;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * Recomment 테이블에 content 업데이트.
 * @param { number } recommentId
 * @param { string } content
 * @returns { Promise<{ recommentId: number, content: string }> | null }
 */
const updateReComment = async (recommentId, content) => {
    try {
        await Recomment.update({ content }, { where: { recommentId } });
        return await Recomment.findOne({ where: { recommentId } });
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * Recomment 테이블에 recommentId 삭제.
 * @param { number } recommentId
 * @returns { Promise<{ recommentId: number }> | null }
 */
const deleteReComment = async (recommentId) => {
    try {
        const deleteComment = await Recomment.destroy({ where: { recommentId } });
        return deleteComment;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

module.exports = {
    findReComment,
    createReComment,
    updateReComment,
    deleteReComment
};
