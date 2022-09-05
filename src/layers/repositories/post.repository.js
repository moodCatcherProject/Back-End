const { User, UserDetail, Post, Item, Like } = require('../../sequelize/models');
const exception = require('../exceptModels/_.models.loader');

const sequelize = require('sequelize');
const Op = sequelize.Op;
//CRUD
// // POST
/**
 *
 * @param {int} userId
 * @param {string} title
 * @param {string} content
 *
 * @returns 게시물 정보를 만들고 나서 그 게시물의 데이터 반환
 */
const createPost = async (userId, title, content, gender) => {
    return await Post.create({
        userId,
        title,
        content,
        gender,
        imgUrl: 'default'
    });
};
/**
 *
 * @param {number} postId
 * @returns 해당 postId의 게시물 데이터
 */
const findPost = async (postId) => {
    return await Post.findOne({
        where: { postId }
    });
};
const findAllPosts = async (page, count, orderKey, order) => {
    return await Post.findAll({
        offset: count * (page - 1),
        limit: count,
        order: [[orderKey, order]]
    });
};

const findRepPost = async (userId) => {
    const repPostIdAttr = await UserDetail.findOne({
        where: { detailId: userId },
        attributes: ['repPostId']
    });

    return await Post.findByPk(repPostIdAttr.repPostId);
};

const findMyPage = async (userId, page, count, orderKey, order) => {
    return await Post.findAll({
        where: { userId },
        offset: count * (page - 1),
        limit: count,
        order: [[orderKey, order]]
    });
};

const findLikePage = async (userId, page, count, orderKey, order, gender) => {
    console.log(orderKey, order);
    const likeIdData = await Like.findAll({
        where: { userId, likeStatus: true }
    });
    const likeIdArr = likeIdData.map((p) => {
        return p.postId;
    });
    console.log(likeIdArr);
    return await Post.findAll({
        where: { gender },
        order: [[orderKey, order]],
        offset: count * (page - 1),
        limit: count
    });
};

const findSearchTitleKeyword = async (keyword, page, count, orderKey, order, gender) => {
    console.log(keyword);
    return await Post.findAll({
        offset: count * (page - 1),
        limit: count,
        where: {
            gender,
            title: {
                [Op.like]: '%' + keyword + '%'
            }
        },
        order: [[orderKey, order]]
    });
};
const findSearchWriterKeyword = async (keyword, page, count) => {
    const userData = await User.findAll({
        offset: count * (page - 1),
        limit: count,
        where: {
            nickname: {
                [Op.like]: '%' + keyword + '%'
            }
        }
    });

    const result = [];

    for (let user of userData) {
        const rep = await findRepPost(user.userId);
        console.log(rep.postId);
        result.push(await findPost(rep.postId));
    }
    return result;
};

const findLikeNumByPostId = async (postId) => {
    return await Like.findAndCountAll({
        where: { postId }
    });
};
/**
 *
 * @param {number} postId
 * @param {string} title
 * @param {string} content
 * @returns 업데이트 된 게시물 데이터
 */
const updatePost = async (postId, title, content, gender) => {
    try {
        await Post.update(
            {
                title,
                content,
                gender
            },
            {
                where: { postId }
            }
        );
    } catch (err) {
        throw new exception.NotFoundException('해당 게시물이 없음.');
    }
    return await findPost(postId);
};

/**
 *
 * @param {number} postId
 * @return 없음 , 실패시 404 에러
 */
const deletePost = async (postId) => {
    try {
        await Post.destroy({
            where: { postId }
        });
    } catch (err) {
        throw new exception.NotFoundException('해당 게시물이 없음.');
    }
};
// // POST ADD
/**
 *
 * @param {number} userId
 * @param {number} repPostId
 * @returns 업데이트 된 대표 게시물의 postId
 */
const updateRepPost = async (userId, repPostId) => {
    try {
        await UserDetail.update(
            {
                repPostId
            },
            {
                where: { detailId: userId }
            }
        );
        const repPostIdData = await UserDetail.findOne({
            where: { detailId: userId }
        });
        return repPostIdData.repPostId;
    } catch (err) {
        throw new exception.NotFoundException('게시물이 없음.');
    }
};

// //ITEM

/**
 *
 * @param {number} postId
 * @param {object} item
 * @returns item데이터
 */
const createItem = async (postId, item) => {
    const { brand, name, imgUrl, price } = item;
    return await Item.create({
        postId,
        brand,
        name,
        imgUrl,
        price
    });
};

/**
 *
 * @param {number} postId
 * @param {object} item
 * @returns 수정 된 item 데이터
 */
const updateItem = async (postId, item) => {
    try {
        const { brand, name, imgUrl, price } = item;
        await Item.update(
            {
                brand,
                name,
                imgUrl,
                price
            },
            {
                where: { postId }
            }
        );
        return await Item.findOne({ where: { postId } });
    } catch (err) {
        throw new exception.NotFoundException('해당 게시물이 없음.');
    }
};

// // IMAGE
/**
 *
 * @param {number} postId
 * @param {string} imgUrl
 * @desc imgUrl은 req.file.key 값을 넣어야 함!
 * @returns 이미지를 업데이트 한 게시물의 데이터
 */
const updateImage = async (postId, imgUrl) => {
    await Post.update(
        {
            imgUrl
        },
        {
            where: { postId }
        }
    );
    //update를 하면 게시물의 정보가 아닌 postId를 return 해주는 것 같아 추가.

    return await findPost(postId);
};
// // NOTICE
const isExistNotice = async (userId) => {
    return await UserDetail.findOne({
        where: { detailId: userId },
        attributes: ['isExistsNotice']
    });
};
//FUNCTION

module.exports = {
    createPost,
    updatePost,
    findPost,
    findAllPosts,
    deletePost,

    findRepPost,
    updateRepPost,

    findMyPage,
    findLikePage,
    findSearchTitleKeyword,
    findSearchWriterKeyword,
    findLikeNumByPostId,

    createItem,
    updateItem,

    updateImage,

    isExistNotice
};
