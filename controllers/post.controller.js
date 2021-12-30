const PostModel = require("../models/post.model");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");

const getAuthorId = async (req) => {
	const token = req.cookies.jwt;
	if (!token) {
		console.log("hello there");
		return {
			status: "notfound",
			data: "No token found sussy baka",
		};
	}
	jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
		if (err) {
			return {
				status: "invalid",
				data: "Invalid token.",
			};
		}
		// best case scenario ( everything is perfect )
		else {
			return {
				status: "ok",
				data: decodedToken.id,
			};
		}
	});
};

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
	const { title, subtitle, body } = req.body;
	const result = await getAuthorId(req);
	let author = null;

	switch (result.status) {
		case "ok": {
			author = result.status;
			break;
		}
		case "notfound": {
			author = "61cdf447de7d88dd6ff69885";
			break;
		}
		default: {
			// returned invalid
			return next(new ErrorResponse("Invalid token, please login again", 401));
		}
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
