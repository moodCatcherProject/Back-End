const postService = require("../services/post.service");
const exception = require("../exceptModels/_.models.loader");

const createPost = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { title, content } = req.body.post;
        const { items } = req.body;
        console.log(title, content, items);
        const postData = await postService.createPost(userId, title, content);
        const itemsData = await postService.createItem(postData.postId, items);

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

const updateImage = (req, res, next) => {
    try {
        const {postId} = req.params
        const imageFileName = req.file ? req.file.key : null;
        const imageData = postService.updateImage(postId,imageFileName)
        return res.status(201).json(
            new exception.FormDto("이미지 업데이트 성공!", {
                image : imageData
            })
        )
    } catch (err) {
        next(err)
    }
};
module.exports = {
    createPost,

    updateImage
};
