const express = require("express");
const router = express.Router();
const {
	getHomePage,
	postCreatePage,
	getCreatePage,
	getPostPage,
	deletePost,
} = require("../controllers/post.controller.js");

// /posts
router.route("/").get(getHomePage);
// /posts/create
router.route("/create").get(getCreatePage).post(postCreatePage);
router.route("/:id").get(getPostPage).delete(deletePost);

module.exports = router;
