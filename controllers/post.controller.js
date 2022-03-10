const PostModel = require("../models/post.model");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const captchaSecret = process.env.CAPTCHA_SECRETKEY;
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const getHomePage = asyncHandler(async (req, res, next) => {
	let query = PostModel.find().sort({ createdAt: -1 });

	// pagination
	const pagination = {};

	// number of objects per page
	const limit = parseInt(req.query.limit, 10) || 5;
	const total = (await PostModel.countDocuments()) || 1;
	const max = Math.ceil(total / limit);
	const page = Math.max(Math.min(parseInt(req.query.page, 10) || 1, max), 1);

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
	res.render("home", { page, posts, pagination, limit, total, max });
});

const linksRegExp = new RegExp(
	/(["'])(?:(?=(\\?))\2((http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?(?!(www.)*((github\.com)|(cdn.discordapp\.com)|(media.discordapp\.net)))([a-z0-9]+([\-_.][a-z0-9]+)*\.[a-z]{2,5})(:[0-9]{1,5})?(\/.*)?))*?\1/gim
);
const cssLinksRegExp = new RegExp(
	/(\()(?:(?=(\\?))\2((http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?(?!(www.)*((github\.com)|(cdn.discordapp\.com)|(media.discordapp\.net)))([a-z0-9]+([\-_.][a-z0-9]+)*\.[a-z]{2,5})(:[0-9]{1,5})?(\/.*)?))*?\)/gim
);
function sanitizeLinks(input) {
	return input.replaceAll(linksRegExp, "''").replaceAll(cssLinksRegExp, "()");
}

function parseMarkdownInput(text) {
	return (
		"<head><style>html,* {padding: 0; margin: 0; font-family: Inter,sans-serif; color: #fff;}</style></head>" +
		sanitizeLinks(
			DOMPurify.sanitize(text.replaceAll("`", "".replaceAll("\\", "")), {
				USE_PROFILES: { html: true },
				FORBID_TAGS: ["style", "head"],
				FORBID_ATTR: ["class", "id", "action", "srcset"],
				ALLOW_DATA_ATTR: false,
			})
		)
	);
}

const postCreatePage = asyncHandler(async (req, res, next) => {
	let { title, subtitle, body, captchaToken } = req.body;
	// captcha
	const recaptchaBody = {
		secret: captchaSecret,
		response: captchaToken,
	};
	const captchaResult = await axios
		.post(
			"https://www.google.com/recaptcha/api/siteverify",
			new URLSearchParams(Object.entries(recaptchaBody)).toString()
		)
		.then(async (res) => await res.data)
		.catch((err) => {
			console.log(err);
			return res.json({
				status: "error",
				error: "Captcha verification failed.",
			});
		});
	if (!captchaResult.success || captchaResult.score < 0.69) {
		return res.json({
			status: "error",
			error: "Captcha verification failed.",
		});
	}

	body = parseMarkdownInput(body);

	// set author
	const author = res.locals.user;

	console.log(author);

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
