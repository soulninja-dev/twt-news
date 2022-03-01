const getJWTAccessToken = require("../utils/getAccessToken");
const fetch = require("node-fetch");

const userinfo_url = "https://discord.com/api/users/@me";

// check if user exists,
// next() if yes, or else reject request
const checkUser = async (req, res, next) => {
	if (!req.cookies.jwt) {
		return res.redirect("/");
	}
	const accessToken = getJWTAccessToken(req, res);
	const result = await fetch(userinfo_url, {
		headers: { authorization: "Bearer " + accessToken },
	})
		.then((data) => data.json())
		.catch((err) => {
			console.log(err);
			return res.status(402).json({
				status: "error",
				message: "Report this bug to SoulNinja#7616",
				error: err,
			});
		});
	if (!result.username) {
		return res.redirect("/");
	}
	next();
};

// check if user exists,
// next() if yes, or else reject request
const setUserInfo = async (req, res, next) => {
	if (!req.cookies.jwt) {
		return next();
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

	console.log("result: ", result);
	if (result.username) {
		// set res.user to result so that we can access user data in controllers
		res.locals.user = result;
		return next();
	}
	next();
};

module.exports = { setUserInfo, checkUser };
