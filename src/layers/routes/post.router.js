const router = require("express").Router()

const postController = require("../controllers/post.controller")
const Upload = require("./middlewares/postImageUploadMiddleware")
const upload = new Upload()
router.route("/")
    .post(postController.createPost)

router.route("/:postId")
    .put(postController.updatePost)
    .delete()
router.put("/:postId/image", upload.upload.single("postImage") , postController.updateImage)
module.exports = router