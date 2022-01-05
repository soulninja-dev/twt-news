const PostModel = require("../models/post.model");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

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
	let query = PostModel.find()
		.sort({ createdAt: -1 })
		.populate({ path: "author", select: "name" });

	// pagination
	const pagination = {};

	// number of objects per page
	const limit = parseInt(req.query.limit, 10) || 5;
	const total = await PostModel.countDocuments();
	const max = Math.ceil(total/limit);
	const page = Math.min(parseInt(req.query.page, 10) || 1, max);

	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	// skipping the objects which is in previous pages, and limiting to limit
	query = query.skip(startIndex).limit(limit);

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	const posts = await query;
	if (posts.length === 0) {
		posts[0] = {
			title: "No posts yet",
			subtitle: "Why don't you start the party :uganda:",
			body: "didn't you read the title and subtitle :mhm:",
			author: {
				id: 0,
				name: ""
			},
			pagination: pagination,
		};
	}

	res.render("home", { page, posts, pagination, limit, total, max });
});

const postCreatePage = asyncHandler(async (req, res, next) => {
	let { title, subtitle, body } = req.body;
	body = DOMPurify.sanitize(body);
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
