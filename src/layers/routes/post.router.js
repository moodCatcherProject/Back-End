const router = require('express').Router();

const postController = require('../controllers/post.controller');
const Upload = require('./middlewares/postImageUploadMiddleware');
const upload = new Upload();

// 게시물 작성(/api/posts)
router.route('/').post(postController.createPost);

// 게시물 전체 조회(/api/posts)
router.get('/', postController.findAllPosts);

// 게시물 상세 조회(/api/posts/detail/:postId)
router.get('/detail/:postId', postController.findOnePost);

// 인기 게시물 조회(/api/posts/popular)
router.get('/popular', postController.findHotPosts);

// 명예의 전당 게시물 조회(/api/posts/honor)
router.get('/honor', postController.findHonorPosts);

// 게시물 수정(/api/posts/:postId)
router.put('/:postId', postController.updatePost);

// 게시물 삭제(/api/posts/:postId)
router.delete('/:postId', postController.deletePost);

// 대표 게시물 지정(/api/posts/:postId)
router.patch('/:postId', postController.updateRepPost);

// 대표 게시물 조회(/api/posts/rep)
router.get('/rep', postController.findRepPost);

// 이미지 업데이트(/api/posts/:postId/image)
router.put('/:postId/image', upload.upload.single('postImage'), postController.updateImage);

module.exports = router;
