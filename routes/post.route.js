const express = require("express");
const router = express.Router();
const {
	getHomePage,
	postCreatePage,
	getCreatePage,
	deletePost,
} = require("../controllers/post.controller.js");

const { protectRoute, checkUser } = require("../middleware/auth");

router.route("/").get(getHomePage);
// router.route("/create").get(getCreatePage).post(protectRoute, postCreatePage);
// router.route("/:id").delete(checkUser, deletePost);

// temp routes without auth
router.route("/create").get(getCreatePage).post(postCreatePage);
router.route("/:id").delete(deletePost);

module.exports = router;
