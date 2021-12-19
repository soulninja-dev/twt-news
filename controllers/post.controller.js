/*
  getHomePage,
  postCreatePage,
  getCreatePage,
  getPostPage,
  deletePost
*/

const getHomePage = (req, res, next) => {
	res.render("home");
};

const postCreatePage = (req, res, next) => {
	res.status(200).json({ status: "ok", data: {} });
};

const getCreatePage = (req, res, next) => {
	res.render("create");
};

const getPostPage = (req, res, next) => {
	res.render("post");
};

const deletePost = (req, res, next) => {
	res.status(200).json({ status: "ok", data: {} });
};

module.exports = {
	getHomePage,
	postCreatePage,
	getCreatePage,
	getPostPage,
	deletePost,
};
