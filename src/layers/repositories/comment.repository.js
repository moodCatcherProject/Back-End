const { Comment, User, Post, Recomment } = require('../../sequelize/models');

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
 * User 테이블에있는 userId를 찾음.
 * @param { number } userId
 * @returns { Promise<{ userId: number }> | null }
 */
const findUser = async (userId) => {
    const findUser = await User.findOne({
        where: { userId }
    });
    return findUser;
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
 * @param { number } postId
 * @param { number } page
 * @param { number } count
 * @param { number } userId
 * @returns { Promise<{ page: number, count: number }> | null }
 */

const getComments = async (postId, page, count, userId) => {
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
};
// const getComments = async (postId, page, count, userId) => {
//     const getComments = await Comment.findAll({
//         offset: count * (page - 1),
//         limit: count,
//         raw: true,
//         attributes: ['userId', 'commentId', 'content', 'createdAt'],
//         where: { postId },
//         include: [
//             {
//                 model: Recomment,
//                 raw: true,
//                 attributes: ['userId', 'recommentId', 'content', 'createdAt']
//             }
//             {   model:
//                      }
//         ]
//     });
// include: [
//     {
//         model: Recomment,
//         raw: true,
//         attributes: ['userId', 'recommentId', 'content', 'createdAt'],
//         include: [
//             {
//                 model: User,
//                 raw: true,
//                 attributes: ['nickname', 'imgUrl', 'grade']
//             }
//         ]
//     }
// ],

//     return getComments;
// };
// include: [
//     {
//         model: User,
//         raw: true,
//         attributes: ['nickname', 'imgUrl', 'grade']
//     }
// ]
// User테이블에서 nickname, imgUrl, grade 가져와서 보여주기

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
    findUser,
    createComment,
    getComments,
    updateComment,
    deleteComment
};
