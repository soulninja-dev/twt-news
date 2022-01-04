const PostModel = require("../models/post.model");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");

const getAuthorId = async (req) => {
	const token = req.cookies.jwt;
	return jwt.verify(
		token,
		process.env.JWT_SECRET,
		async (err, decodedToken) => {
			if (err) {
				const result = { status: "invalid", data: "Invalid token" };
				return result;
			}
			// best case scenario ( everything is perfect )
			else {
				const result = { status: "ok", data: decodedToken.id };
				return result;
			}
		}
	);
};

const getHomePage = asyncHandler(async (req, res, next) => {
	const posts = await PostModel.find()
		.sort({ createdAt: -1 })
		.populate({ path: "author", select: "name" });

	if (posts.length === 0) {
		posts[0] = {
			title: "No posts yet",
			subtitle: "Why don't you start the party :uganda:",
			body: "didn't you read the title and subtitle :mhm:",
		};
	}

	res.render("home", { posts });
});

const postCreatePage = asyncHandler(async (req, res, next) => {
	const { title, subtitle, body } = req.body;
	const result = await getAuthorId(req);
	console.log(result);
	let author;
	if (result.status === "ok") {
		author = result.data;
	} else {
		return next(new ErrorResponse(result.data, 401));
	}

	await PostModel.create({
		title,
		subtitle,
		body,
		author,
	});
	res.status(201).json({ status: "ok" });
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
