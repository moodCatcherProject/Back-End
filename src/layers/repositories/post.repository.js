const { User, Post, Item } = require("../../sequelize/models");
const exception = require("../exceptModels/_.models.loader");

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
Post.findOne({}).then;

const createPost = async (userId, title, content) => {
    return await Post.create({
        userId,
        title,
        content,
        imgUrl: "default",
    });
};
/**
 *
 * @param {number} postId
 * @returns 해당 postId의 게시물 데이터
 */
const findPost = async (postId) => {
    return await Post.findOne({
        where: { postId },
    });
};

const updatePost = async (postId, title, content) => {
    try {
        await Post.update(
            {
                title,
                content,
            },
            {
                where: { postId },
            }
        );
    } catch (err) {
        throw new exception.NotFoundException("해당 게시물이 없음.");
    }
    return await findPost(postId);
};

const deletePost = async (postId) => {
    try{
        await Post.destroy({
            where : {postId}
        })
    }catch(err){
        throw new exception.NotFoundException("해당 게시물이 없음.")
    }
}
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
        price,
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
                price,
            },
            {
                where: { postId },
            }
        );
        return await Item.findOne({ postId });
    } catch (err) {
        throw new exception.NotFoundException("해당 게시물이 없음.")
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
            imgUrl,
        },
        {
            where: { postId },
        }
    );
    //update를 하면 게시물의 정보가 아닌 postId를 return 해주는 것 같아 추가.
    return await findPost(postId);
};
//FUNCTION

module.exports = {
    createPost,
    updatePost,
    findPost,
    deletePost,
    
    createItem,
    updateItem,

    updateImage,
};
