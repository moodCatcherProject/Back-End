const { Recomment } = require('../../sequelize/models');

/**
 * Recomment에있는 recommentId를 찾음.
 * @param { string } recommentId
 * @returns { Promise<{ recommentId: number }> | null }
 */
const findReComment = async (recommentId) => {
    const findReComment = await Recomment.findOne({
        where: { recommentId }
    });
    return findReComment;
};

/**
 * Recomment 테이블에 commentId, content, userId 생성.
 * @param { number } commentId
 * @param { string } content
 * @param { number } userId
 * @returns { Promise<{ commentId: number, content: string, userId: number }> | null }
 */
const createReComment = async (commentId, content, userId) => {
    const createdComment = await Recomment.create({
        commentId,
        content,
        userId
    });
    return createdComment;
};

/**
 * Recomment 테이블에 content 업데이트.
 * @param { number } recommentId
 * @param { string } content
 * @returns { Promise<{ recommentId: number, content: string }> | null }
 */
const updateReComment = async (recommentId, content) => {
    await Recomment.update({ content }, { where: { recommentId } });
    return await Recomment.findOne({ where: { recommentId } });
};

/**
 * Recomment 테이블에 recommentId 삭제.
 * @param { number } recommentId
 * @returns { Promise<{ recommentId: number }> | null }
 */
const deleteReComment = async (recommentId) => {
    const deleteComment = await Recomment.destroy({ where: { recommentId } });
    return deleteComment;
};

module.exports = {
    findReComment,
    createReComment,
    updateReComment,
    deleteReComment
};
