const router = require('express').Router();

const postController = require('../controllers/post.controller');
const Upload = require('./middlewares/postImageUploadMiddleware');
const upload = new Upload();
router.route('/').post(postController.createPost);

router.post('/image/:postId', upload.upload.single('postImage'), postController.updateImage);
module.exports = router;
