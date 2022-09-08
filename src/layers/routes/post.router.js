const router = require('express').Router();

const postController = require('../controllers/post.controller');
const Upload = require('./middlewares/postImageUploadMiddleware');
const upload = new Upload();

//게시물 작성(/api/posts)
router.route('/').post(postController.createPost);

// 게시물 수정(/api/posts/:postId)
router.put('/:postId', postController.updatePost);

// 게시물 전체 조회(/api/posts)
router.get('/', postController.findAllPosts);

// 게시물 상세 조회(/api/posts/:postId)
router.get('/:postId', postController.findOnePost);

// 대표 게시물 지정(/api/posts/:postId)
router.patch('/:postId', postController.updateRepPost);

// 게시물 삭제(/api/posts/:postId)
router.delete('/:postId', upload.delete_file, postController.deletePost);

// 이미지 업데이트(/api/posts/:postId/image)
router.put('/:postId/image', upload.upload.single('postImage'), postController.updateImage);

module.exports = router;
