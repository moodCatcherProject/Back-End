const postRepository = require("../repositories/post.repository");
const exception = require("../exceptModels/_.models.loader");
//CRUD

/**
 *
 * @param {string} title
 * @param {string} content
 * @param {Object} imgFile
 * @param {Array} items
 */
const createPost = async (userId, title, content, imgFile) => {
    isExistValue(title, "제목이 빈 값");
    isExistValue(imgFile, "게시물 이미지가 빈 값");

    const createPostData = await postRepository.createPost(
        userId,
        title,
        content,
        imgFile?.key
    );
    return createPostData
};


//ITEM
const createItem = async (postId, items) => {
    const createItemData = []
    for (let item in items) {
        createItemData.push(await postRepository.createItem(postId, item))
    }
    return createItemData;
};

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
        throw exception.NotFoundException(msg);
    }
};

module.exports = {
    createPost,

    createItem
};
