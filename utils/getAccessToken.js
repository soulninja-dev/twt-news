const jwt = require("jsonwebtoken");
// get the access_token stored in the cookie in the request
const getJWTAccessToken = (req, res, next) => {
	let accessToken = "";
	console.log("jwt in getJWTAccessToken");
	console.log(req.cookies);
	console.log(req.cookies.jwt);
	jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decodedToken) => {
		if (err) {
			return res.status(500).json({
				status: "error",
				message: "Report this to SoulNinja#7616",
				error: err,
			});
		}
		console.log(decodedToken);
		console.log(`getting jwt cookie -> ${decodedToken.access_token}`);
		accessToken = decodedToken.access_token;
	});
	return accessToken;
};

module.exports = getJWTAccessToken;
