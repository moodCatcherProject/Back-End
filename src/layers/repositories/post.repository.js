const { User, Post, Item } = require('../../sequelize/models');

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
Post.findOne({}).then 


const createPost = async (userId, title, content) => {
    return await Post.create({
        userId,
        title,
        content,
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
        where : {postId}
    })
}
// //ITEM


/**
 * 
 * @param {number} postId 
 * @param {object} item 
 * @returns item데이터 반환
 */
const createItem = async (postId,item) => {
    const { brand, name, imgUrl, price } = item;
    return await Item.create({
        postId,
        brand,
        name,
        imgUrl,
        price
    });
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
    await Post.update({
        imgUrl
    } , {
        where : {postId}
    })
    //update를 하면 게시물의 정보가 아닌 postId를 return 해주는 것 같아 추가.
    return findPost(postId)
}

//FUNCTION


module.exports = {
    createPost,

    createItem,

    updateImage
};
