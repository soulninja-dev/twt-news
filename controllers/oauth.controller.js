const fetch = require("node-fetch");
const { stringify } = require("query-string");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/async");
const getJWTAccessToken = require("../utils/getAccessToken");

// constants
const redirect_url = process.env.REDIRECT_URL;
const userinfo_url = "https://discord.com/api/users/@me";

const expireTime = 7 * 24 * 60 * 60;
// generate jwt token stored in cookie with the payload
function generateJWTToken(payload) {
	console.log(`signing payload: `);
	console.log(payload);
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expireTime });
}

// get access token from discord
const getAccessToken = async (req, res) => {
	// sending post req to discord to get access token
	const tokenURL = "https://discord.com/api/oauth2/token";

	// settings param when just access_token needs to be requested from discord
	const params = {
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
		grant_type: "authorization_code",
		code: req.query.code,
		redirect_uri: `${req.protocol}://${req.get("host")}/auth/discord`,
	};
	console.log(params);
	// send POST to discord access_token API with needed info
	const OAuthResult = await fetch(tokenURL, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: stringify(params),
	})
		.then((data) => data.json())
		.catch((err) => {
			console.log(err);
		});

	console.log(`OAuthResult: `);
	console.log(OAuthResult);
	// setting cookie
	const token = generateJWTToken({ access_token: OAuthResult.access_token });
	console.log(`token: ${token}`);
	res.cookie("jwt", token, { httpOnly: true, maxAge: expireTime * 1000 });

	return OAuthResult.access_token;
};

// GET /auth/discord
// redirect url, so handles the query param part too
const discordAuth = asyncHandler(async (req, res) => {
	// redirecting to discord redirect if query param code is not present
	if (!req.query.code) {
		return res.redirect(redirect_url);
	}
	const accessToken = await getAccessToken(req, res);
	res.redirect("/");
});

// GET /api/user
// send back user info from discord api
const getUserInfo = asyncHandler(async (req, res, next) => {
	if (!req.cookies.jwt) {
		return res.status(401).json({
			status: "error",
			error: "not logged in",
		});
	}
	const accessToken = getJWTAccessToken(req, res);
	const result = await fetch(userinfo_url, {
		headers: { authorization: "Bearer " + accessToken },
	})
		.then((data) => data.json())
		.catch((err) => {
			console.log(err);
			return res.status(402).json({ status: "error", error: err });
		});
	if (!result.username) {
		return res.redirect("/auth/logout");
	}
	res.status(200).json({
		status: "ok",
		result,
	});
});

// GET /auth/logout
// remove jwt token and redirect
const logOut = asyncHandler(async (req, res) => {
	res.cookie("jwt", "", { maxAge: 1 });
	return res.redirect("/");
});

module.exports = {
	discordAuth,
	getUserInfo,
	logOut,
};
