const postRepository = require('../repositories/post.repository');
const likeRepository = require('../repositories/like.repository');
const userRepository = require('../repositories/user.repository');
const exception = require('../exceptModels/_.models.loader');
//CRUD
// // POST
/**
 *
 * @param {string} title
 * @param {string} content
 * @param {Array} items
 * @returns 생성 된 게시물의 데이터
 */
const createPost = async (userId, title, content, gender) => {
    const createPostData = await postRepository.createPost(userId, title, content, gender);

    return createPostData;
};

/**
 * 게시물 상세 조회
 * @param {number} postId
 * @param {number} userId
 * @returns { Promise<{ post: {postId:number, title:string, content:string, userId:number, imgUrl:string,
 *  likeCount:number, createdAt:date, likeStatus:string }, items: [{ brand:string, name:string, price:string, imgUrl:string }] } | null>}
 */
const findOnePost = async (postId, userId) => {
    const isExistsPost = await postRepository.findPost(postId);
    if (!isExistsPost) throw new exception.NotFoundException('해당 게시물 없음');

    let post;
    const isExistsLike = await likeRepository.findLikeByUserIdAndPostId(userId, postId);
    if (isExistsLike) {
        post = await postRepository.findPostDetailWithLikeStatus(postId, userId);
    } else {
        post = await postRepository.findPostDetail(postId);
    }
    const items = await postRepository.findItems(postId);

    return {
        post: {
            userId: post['userId'],
            postId: post['postId'],
            title: post['title'],
            content: post['content'],
            imgUrl: process.env.S3_STORAGE_URL + post['imgUrl'],
            likeCount: post['likeCount'],
            createdAt: post['createdAt'],
            likeStatus: post['Likes.likeStatus']
        },
        items
    };
};

/**
 *
 * @param {string} title
 * @param {string} content
 *
 * @returns 업데이트 된 게시물의 데이터
 */
const updatePost = async (userId, postId, title, content, gender) => {
    title = new exception.isString({ title }).trim;
    await isExistPostOfUser(userId, postId);
    const createPostData = await postRepository.updatePost(postId, title, content, gender);

    return createPostData;
};

/**
 *
 * @param {number} userId
 * @param {number} postId
 * @returns 없음.
 */
const deletePost = async (userId, postId) => {
    await isExistPostOfUser(userId, postId);
    postRepository.deletePost(postId);
    return;
};
// // // POST ADD
/**
 *
 * @param {number} userId
 * @param {number} repPostId
 * @returns 대표 게시물로 지정된 postId
 */
const updateRepPost = async (userId, repPostId) => {
    await isExistPostOfUser(userId, repPostId);
    return await postRepository.updateRepPost(userId, repPostId);
};

/**
 * 대표 게시물 조회
 * @param {number} userId
 * @returns { Promise<{ postId:number, userId:number, imgUrl:string, title:string, content:string, likeCount:number, createdAt:date } | null>}
 */
const findRepPost = async (userId) => {
    const userStatus = await userRepository.getUserStatusByUserId(userId);
    if (!userStatus.repPostId) {
        return {};
    }

    const repPost = await postRepository.findPost(userStatus.repPostId);

    return {
        postId: repPost['postId'],
        userId: repPost['userId'],
        imgUrl: process.env.S3_STORAGE_URL + repPost['imgUrl'],
        title: repPost['title'],
        content: repPost['content'],
        likeCount: repPost['likeCount'],
        createdAt: repPost['createdAt']
    };
};

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
    console.log();
    return createItemData;
};

/**
 *
 * @param {number} postId
 * @param {Array} items
 * @desc items는 배열 그대로 받아 repository의 함수를 배열 수만큼 실행합니다.
 * @returns 업데이트 된 아이템의 데이터
 */
const updateItem = async (postId, items) => {
    const updateItemData = [];
    for (let item of items) {
        updateItemData.push(await postRepository.updateItem(postId, item));
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
    if (!imageFileName) throw new exception.BadRequestException('게시물 이미지가 빈 값');
    const updateImageData = await postRepository.updateImage(postId, imageFileName);
    updateImageData.imgUrl = process.env.S3_STORAGE_URL + updateImageData.imgUrl;
    console.log(updateImageData.imgUrl);
    return updateImageData;
};

// // NOTICE
const isExistNotice = async (userId) => {
    const isExistNoticeData = await postRepository.isExistNotice(userId);
    return isExistNoticeData.isExistsNotice;
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
        throw new exception.UnauthorizedException('게시물의 작성자가 아님.');
    }
};

module.exports = {
    createPost,
    findOnePost,
    updatePost,
    deletePost,

    findRepPost,
    updateRepPost,

    createItem,
    updateItem,

    updateImage,

    isExistNotice
};
