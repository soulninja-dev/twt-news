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
		console.log("error: no jwt cookie -> not setting user data");
		res.locals.user = null;
		return next();
	}
	const accessToken = getJWTAccessToken(req, res);
	console.log(`access_token: ${accessToken}`);
	const result = await fetch(userinfo_url, {
		headers: { authorization: "Bearer " + accessToken },
	})
		.then((data) => data.json())
		.catch((err) => {
			console.log(err);
			return res.status(402).json({ status: "error", error: err });
		});

	console.log("result: ");
	console.log(result);

	if (result.username) {
		// set res.user to result so that we can access user data in controllers
		const user = result.username + "#" + result.discriminator;
		console.log(`setting user data -> ${user}`);
		res.locals.user = user;
		return next();
	}

	console.log("error: else condition -> setting user to null (wrong result)");
	res.locals.user = null;
	next();
};

module.exports = { setUserInfo, checkUser };
