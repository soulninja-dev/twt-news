const express = require("express");
const router = express.Router();
const {
	getAuth,
	postLogin,
	postRegister,
} = require("../controllers/auth.controller");

router.route("/").get(getAuth);
router.route("/login").post(postLogin);
router.route("/register").post(postRegister);

module.exports = router;
