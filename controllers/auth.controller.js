/*
	getAuth,
	postLogin,
	postRegister
*/

const getAuth = (req, res, next) => {
	res.render("login");
};

const postLogin = (req, res, next) => {
	res.status(200).json({ status: "ok", data: {} });
};

const postRegister = (req, res, next) => {
	res.status(200).json({ status: "ok", data: {} });
};

module.exports = {
	getAuth,
	postLogin,
	postRegister,
};
