const postService = require("../services/post.service");
const exception = require("../exceptModels/_.models.loader");

// CRUD
// //POST

const createPost = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const { title, content } = req.body.post;
        const { items } = req.body;
        const postData = await postService.createPost(userId, title, content);
        const itemsData = await postService.createItem(postData.postId, items);

        return res.status(201).json(
            //확인 데이터
            new exception.FormDto("게시물 작성 성공", {
                post: postData,
                items: itemsData,
            })
        );
    } catch (err) {
        next(err);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { postId } = req.params;
        const { title, content } = req.body.post;
        const { items } = req.body;

        const postData = await postService.updatePost(
            userId,
            postId,
            title,
            content
        );
        const itemData = await postService.updateItem(items);

        return res.status(201).json(
            //확인 데이터
            new exception.FormDto("게시물 수정 성공", {
                postData,
                itemData,
            })
        );
    } catch (err) {
        next(err);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { postId } = req.params;
        await deletePost(userId, postId);
        return res
            .status(200)
            .json(new exception.FormDto("게시물 삭제 성공", {}));
    } catch (err) {
        next(err);
    }
};
// // IMAGE
const updateImage = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const imageFileName = req.file ? req.file.key : null;
        const imageData = await postService.updateImage(postId, imageFileName);
        return res.status(201).json(
            //확인 데이터
            new exception.FormDto("이미지 업데이트 성공!", {
                image: imageData,
            })
        );
    } catch (err) {
        next(err);
    }
};
module.exports = {
    createPost,
    updatePost,

    updateImage,
};
