const postService = require("../services/post.service");
const exception = require("../exceptModels/_.models.loader");

const createPost = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { title, content } = req.body.post;
        const  imgFile  = req.file;
        const { items } = req.body;

        const postData = await postService.createPost(
            userId,
            title,
            content,
            imgFile,
            
        );
        const itemsData = await postService.createItem(
            createPostData.postId,
            items
        );

        return res.status(201).json(
            new exception.FormDto("게시물 작성 성공", {
                post: postData,
                items: itemsData,
            })
        );
    } catch (err) {
        next(err);
    }
};
module.exports = {
    createPost,
};
