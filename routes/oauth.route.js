const express = require("express");
const router = express.Router();
const {
	discordAuth,
	getUserInfo,
	logOut,
} = require("../controllers/oauth.controller");

router.route("/discord").get(discordAuth);
router.route("/user").post(getUserInfo);
router.route("/logout").get(logOut);

module.exports = router;
