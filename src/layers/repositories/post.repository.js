const { User, Post, Item } = require("../../sequelize/models");

//POST CRUD
/**
 *
 * @param {int} userId
 * @param {string} title
 * @param {string} content
 * @param {string} imgUrl
 * 
 * @returns 게시물 정보를 만들고 나서 그 게시물의 데이터 반환
 */
const createPost = async (userId, title, content, imgUrl) => {
    return await Post.create({
        userId,
        title,
        content,
        imgUrl,
    });
    
};

//ITEM

const createItem = async (postId,item) => {
    const { brand, name, imgUrl, price } = item;
    return await Item.create({
        postId,brand,name,imgUrl,price
    });

};
//FUNCTION

module.exports = {
    createPost,
    createItem
}
