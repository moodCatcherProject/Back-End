const router = require("express").Router()

const postController = require("../controllers/post.controller")

router.route("/")
    .post(postController.createPost)

module.exports = router