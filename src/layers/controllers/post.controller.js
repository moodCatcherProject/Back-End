const postService = require('../services/post.service');

const exception = require('../exceptModels/_.models.loader');

// CRUD
// //POST

/**
 * @version 확인데이터
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns 작성한 게시물의 데이터
 */
const createPost = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const { gender } = res.locals.detailUser;
        const { title, content } = req.body.post;
        const { items } = req.body;
        const postData = await postService.createPost(userId, title, content, gender);
        const itemsData = await postService.createItem(userId, postData.postId, items);

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

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns 필터를 거친 전체게시물 데이터
 */
const findAllPosts = async (req, res, next) => {
    try {
        let { userId } = req.query;
        let { type, keyword, sort, gender, page, count, order } = req.query;
        userId = userId ? userId : res.locals.user.userId;
        page = page ? page : 1;
        count = count ? count : 8;

        const postData = await postService.findAllPosts(
            userId,
            keyword,
            sort,
            type,
            gender,
            parseInt(page),
            parseInt(count),
            order
        );
        for (let post of postData) {
            post.likeStatus = await postService.findLikeStatus(res.locals.user.userId, post.postId);
            post.imgUrl = process.env.S3_STORAGE_URL + post.imgUrl;
        }

        res.status(200).send(postData);
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const findOnePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userId } = res.locals.user;

        const post = await postService.findOnePost(postId, userId);

        return res.status(200).json(new exception.FormDto('게시물 상세 조회 성공', post));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const findHotPosts = async (req, res, next) => {
    // await postService.createHotPosts();
    const hotPosts = await postService.findHotPosts();

    return res.status(200).json(new exception.FormDto('인기 게시물 조회 성공', { hotPosts }));
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns 수정한 게시물의 데이터
 */
const updatePost = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const { gender } = res.locals.detailUser;
        const { postId } = req.params;
        const { title, content } = req.body.post;
        const { items } = req.body;

        const postData = await postService.updatePost(userId, postId, title, content, gender);
        const itemsData = await postService.updateItem(postData.postId, items);

        return res.status(201).json(
            new exception.FormDto('게시물 수정 성공', {
                post: postData,
                items: itemsData
            })
        );
    } catch (err) {
        next(err);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const { postId } = req.params;
        await postService.deletePost(userId, postId);
        res.status(200).json(new exception.FormDto('게시물 삭제 성공'));
    } catch (err) {
        next(err);
    }
};

// // //POST ADD

const updateRepPost = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const { postId } = req.params;
        const repPostIdData = await postService.updateRepPost(userId, postId);
        res.status(200).json(
            new exception.FormDto('대표 게시물 지정 성공', {
                repPostId: repPostIdData
            })
        );
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const findRepPost = async (req, res, next) => {
    try {
        const { userId } = req.query;

        const repPost = await postService.findRepPost(userId);

        return res.status(200).json(new exception.FormDto('대표 게시물 조회 성공', { repPost }));
    } catch (err) {
        next(err);
    }
};

// // IMAGE
const updateImage = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userId } = res.locals.user;
        const imageFileName = req.file ? req.file.key : null;
        const imageData = await postService.updateImage(userId, postId, imageFileName);
        return res.status(201).json(
            new exception.FormDto('이미지 업데이트 성공!', {
                image: imageData
            })
        );
    } catch (err) {
        next(err);
    }
};

// // NOTICE

module.exports = {
    createPost,
    findAllPosts,
    findOnePost,
    findHotPosts,
    updatePost,
    deletePost,

    updateRepPost,
    findRepPost,

    updateImage
};
