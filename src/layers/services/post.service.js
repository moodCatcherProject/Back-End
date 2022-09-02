const postRepository = require("../repositories/post.repository");
const exception = require("../exceptModels/_.models.loader");
//CRUD
// // POST
/**
 *
 * @param {string} title
 * @param {string} content
 * @param {Array} items
 * @returns 생성 된 게시물의 데이터
 */
const createPost = async (userId, title, content) => {
    isExistValue(title, "제목이 빈 값");

    const createPostData = await postRepository.createPost(
        userId,
        title,
        content
    );
    return createPostData;
};
/**
 *
 * @param {string} title
 * @param {string} content
 *
 * @returns 업데이트 된 게시물의 데이터
 */
const updatePost = async (userId, postId, title, content) => {
    title = new exception.isString(title).trim;
    isExistPostOfUser(userId, postId);
    const createPostData = await postRepository.createPost(
        postId,
        title,
        content
    );
    return createPostData;
};

const deletePost = async ( userId, postId) => {
    isExistPostOfUser(userId, postId);
    postRepository.deletePost(postId)
    return;
    
}

// //ITEM
/**
 *
 * @param {number} postId
 * @param {Array} items
 * @desc items는 배열 그대로 받아 repository의 함수를 배열 수만큼 실행합니다.
 * @returns 생성 된 아이템들의 데이터
 */
const createItem = async (postId, items) => {
    const createItemData = [];
    for (let item of items) {
        createItemData.push(await postRepository.createItem(postId, item));
    }
    return createItemData;
};

const updateItem = async (postId, items) => {
    const updateItemData = [];
    for (let item of items) {
        createItemData.push(await postRepository.createItem(postId, item));
    }
    return updateItemData;
};
// // IMAGE
/**
 *
 * @param {number} postId
 * @param {string} imageFileName
 * @returns 업데이트 된 이미지가 들어간 게시물 데이터
 */
const updateImage = async (postId, imageFileName) => {
    if (!imageFileName)
        throw new exception.BadRequestException("게시물 이미지가 빈 값");
    const updateImageData = await postRepository.updateImage(
        postId,
        imageFileName
    );
    updateImageData.imgUrl =
        process.env.S3_STORAGE_URL + updateImageData.imgUrl;

    return updateImageData;
};
//FUNGTION

/**
 *
 * @param {number} userId
 * @param {number} postId
 * @returns 해당 게시물이 로그인한 사용자의 게시물인지 확인
 * 사용자의 게시물이 맞으면 true 아니면 401에러
 */
const isExistPostOfUser = async (userId, postId) => {
    const postData = await postRepository.findPost(postId);
    if (userId === postData.userId) {
        return true;
    } else {
        throw new exception.UnauthorizedException("게시물의 작성자가 아님.");
    }
};

module.exports = {
    createPost,
    updatePost,
    deletePost,

    createItem,
    updateItem,

    updateImage,
};
