const router = require('express').Router();

const postController = require('../controllers/post.controller');
const Upload = require('./middlewares/postImageUploadMiddleware');
const upload = new Upload();
//게시물 작성 /api/posts
router.route('/').post(postController.createPost);

// 게시물 수정 /api/posts/:postId
router.put('/:postId', postController.updatePost);

//대표 게시물 지정 /api/posts/:postId
router.patch('/:postId', postController.updateRepPost);

// 게시물 삭제  /api/posts/:postId
router.delete('/:postId', postController.deletePost);

// 이미지 업데이트  /api/:postId/image
router.put('/:postId/image', upload.upload.single('postImage'), postController.updateImage);
module.exports = router;
