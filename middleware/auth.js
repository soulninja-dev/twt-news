const jwt = require("jsonwebtoken");
const postModel = require("../models/post.model");
const User = require("../models/user.model");

// what is the use of this? - to protect routes where only " logged in " users are allowed
const protectRoute = (req, res, next) => {
	const token = req.cookies.jwt;

	// making sure token exists in the cookies
	if (token) {
		// verify the token signature
		jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
			// wrong jwt token ( token has been tampered with or has expired )
			if (err) {
				res.redirect("/auth");
			}
			// best case scenario ( everything is perfect )
			else {
				next();
			}
		});
	}
	// if token does not exist in cookies, then go to home page, coz home page should be accessible without logging in too
	else {
		res.redirect("/posts");
	}
};

const setUserInfo = async (req, res, next) => {
	const token = req.cookies.jwt;
	// making sure token exists in the cookies
	if (token) {
		// verify the token signature
		jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
			// wrong jwt token ( token has been tampered with or has expired )
			// set user to null
			if (err) {
				res.locals.user = { name: "anonymous" };
				next();
			}
			// best case scenario ( everything is perfect )
			else {
				// find user in db, populate user info in res.locals.user
				const user = await User.findById(decodedToken.id);
				if (!user) {
					res.cookie("jwt", "", { maxAge: 1 });
				}
				res.locals.user = user;
				next();
			}
		});
	}
	// if token does not exist in cookies, then set user to null, and go to next middleware
	else {
		res.locals.user = { name: "anonymous" };
		next();
	}
};

// for the delete method
const checkUser = async (req, res, next) => {
	const token = req.cookies.jwt;
	const post = await postModel.findById(req.params.id);
	if (!post) {
		return res.redirect("/");
	}
	const userId = post.author;

	// making sure token exists in the cookies
	if (token) {
		// verify the token signature
		jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
			// wrong jwt token ( token has been tampered with or has expired )
			if (err) {
				res.redirect("/auth");
			}
			// best case scenario ( everything is perfect )
			else {
				if (userId == decodedToken.id) {
					next();
				} else {
					res.redirect("/posts");
				}
			}
		});
	}
	// if token does not exist in cookies, then go to home page, coz home page should be accessible without logging in too
	else {
		res.redirect("/posts");
	}
};

module.exports = { protectRoute, setUserInfo, checkUser };
