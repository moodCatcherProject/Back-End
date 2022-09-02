const postService = require('../services/post.service');
const exception = require('../exceptModels/_.models.loader');

// CRUD
// //POST

const createPost = async (req, res, next) => {
    try {
        
        const userId =  1;
        
        const { title, content } = req.body.post;
        const { items } = req.body;
        const postData = await postService.createPost(userId, title, content);
        const itemsData = await postService.createItem(postData.postId, items);

        return res.status(201).json(
            new exception.FormDto('게시물 작성 성공', {
                post: postData,
                items: itemsData
            })
        );
    } catch (err) {
        next(err);
    }
};

const updatePost = (req, res, next) => {
    try{
        const userId = req.user.userId
        const {postId} = req.params;
        const { title, content } = req.body.post;
        const { items } = req.body;

    }catch(err){

    }
}
// // IMAGE
const updateImage = async(req, res, next) => {
    try {
        const { postId } = req.params;
        const imageFileName = req.file ? req.file.key : null;
        const imageData = await postService.updateImage(postId,imageFileName)
        return res.status(201).json(
            new exception.FormDto('이미지 업데이트 성공!', {
                image: imageData
            })
        );
    } catch (err) {
        next(err);
    }
};
module.exports = {
    createPost,

    updateImage
};
