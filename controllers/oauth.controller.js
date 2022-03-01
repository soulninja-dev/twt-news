const fetch = require("node-fetch");
const { stringify } = require("query-string");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/async");

// constants
const redirect_url =
	"https://discord.com/api/oauth2/authorize?client_id=930166100904255549&redirect_uri=http%3A%2F%2Flocalhost%3A1717%2Fauth%2Fdiscord&response_type=code&scope=identify";
const userinfo_url = "https://discord.com/api/users/@me";

const expireTime = 50 * 24 * 60 * 60;
// generate jwt token stored in cookie with the payload
function generateJWTToken(payload) {
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

	// setting cookie
	res.cookie(
		"jwt",
		generateJWTToken({ access_token: OAuthResult.access_token }),
		{ httpOnly: true, maxAge: expireTime * 1000 }
	);

	return OAuthResult.access_token;
};

// get the access_token stored in the cookie in the request
const getJWTAccessToken = (req, res) => {
	let accessToken = "";
	jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decodedToken) => {
		if (err) {
			return res.status(500).json({ status: "error", error: err });
		}
		accessToken = decodedToken.access_token;
	});
	return accessToken;
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