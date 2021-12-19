// imports
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");

// mongoose db
const mongoose = require("mongoose");

// dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

// uri of the database
const dbURI = process.env.DBURI.toString();
const PORT = process.env.PORT || 3000;

mongoose
	.connect(dbURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((result) => {
		app.listen(PORT);
		console.log(`listening on http://localhost:${PORT} \nConnected to DB`);
	})
	.catch((err) => console.log(err));

// setting the view engine as ejs
app.set("view engine", "ejs");

// middleware & static files
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// route handlers
const postsRouter = require("./routes/post.route");
const authRouter = require("./routes/auth.route");

app.get("/", (req, res) => {
	res.redirect("/posts");
});

// route handlers for posts and auth
app.use("/posts", postsRouter);
app.use("/auth", authRouter);
app.use(errorHandler);
