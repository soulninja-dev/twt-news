const PostModel = require("../models/post.model");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const getHomePage = asyncHandler(async (req, res, next) => {
	const posts = await PostModel.find().sort({ createdAt: -1 });

	if (posts.length == 0) {
		posts[0] = {
			title: "No posts yet",
			subtitle: "Why don't you start the party :uganda:",
			body: "didn't you read the title and subtitle :mhm:",
		};
	}

	res.render("home", { posts });
});

const postCreatePage = asyncHandler(async (req, res, next) => {
	const { title, subtitle, body, author } = req.body;
	await PostModel.create({
		title,
		subtitle,
		body,
		author,
	});

	res.redirect("/posts");
});

const getCreatePage = (req, res, next) => {
	res.render("create");
};

const deletePost = asyncHandler(async (req, res, next) => {
	const id = req.params.id;
	const post = await PostModel.findById(id);

	if (!post) {
		return next(new ErrorResponse(`No post with id ${id}`));
	}

	post.remove();
	res.status(202).json({ status: "ok", data: { post } });
});

module.exports = {
	getHomePage,
	postCreatePage,
	getCreatePage,
	deletePost,
};
