const express = require("express");
const router = express.Router();
const {
	getAuth,
	postLogin,
	postRegister,
	logOut,
} = require("../controllers/auth.controller");

router.route("/").get(getAuth);
router.route("/login").post(postLogin);
router.route("/register").post(postRegister);
router.route("/logout").get(logOut);

module.exports = router;
