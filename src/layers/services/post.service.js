const postRepository = require("../repositories/post.repository");
const exception = require("../exceptModels/_.models.loader");
//CRUD
// // POST
/**
 *
 * @param {string} title
 * @param {string} content
 * @param {Array} items
 */
const createPost = async (userId, title, content, ) => {
    isExistValue(title, "제목이 빈 값");
    

    const createPostData = await postRepository.createPost(
        userId,
        title,
        content,
        
    );
    return createPostData
};



// //ITEM
const createItem = async (postId, items) => {
    const createItemData = []
    for (let item of items) {
        createItemData.push(await postRepository.createItem(postId, item))
    }
    return createItemData;
};
// // IMAGE
const updateImage = async(postId,imageFileName) => {
    if (!imageFileName) throw new exception.BadRequestException("게시물 이미지가 빈 값");
    return await postRepository.updateImage(postId, imageFileName)
}
//FUNGTION
/**
 *
 * @param {string} value
 * @returns value값이 존재하면 true 없으면 throw 404 NotFoundException(msg)
 */
const isExistValue = (value, msg) => {
    if (value) {
        return true;
    } else {
        throw new exception.NotFoundException(msg);
    }
};

module.exports = {
    createPost,

    createItem,

    updateImage
};
