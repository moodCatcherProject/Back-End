const { User, Post, Item } = require("../../sequelize/models");

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
const createPost = async (userId, title, content) => {
    return await Post.create({
        userId,
        title,
        content,
        imgUrl:"default"
        
    });
    
};

// //ITEM

const createItem = async (postId,item) => {
    const { brand, name, imgUrl, price } = item;
    return await Item.create({
        postId,brand,name,imgUrl,price
    });

};
// // IMAGE
const updateImage = async (postId, imaUrl) => {
    return await Post.update({
        imaUrl
    } , {
        where : {postId}
    })
}
//FUNCTION

module.exports = {
    createPost,
    
    createItem,

    updateImage
}
