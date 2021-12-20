const express = require("express");
const router = express.Router();
const {
	getHomePage,
	postCreatePage,
	getCreatePage,
	getPostPage,
	deletePost,
} = require("../controllers/post.controller.js");

const { protectRoute, checkUser } = require("../middleware/auth");

// /posts
router.route("/").get(getHomePage);
// /posts/create
router.route("/create").get(getCreatePage).post(protectRoute, postCreatePage);
// todo:  for delete req, add a middleware which checks if the author.id matches the jwt user's id
router.route("/:id").get(getPostPage).delete(checkUser, deletePost);

module.exports = router;
