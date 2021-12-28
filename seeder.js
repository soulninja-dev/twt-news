const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// load env
dotenv.config({ path: "./config/.env" });

// load  models
const UserModel = require("./models/user.model");
const PostModel = require("./models/post.model");

mongoose.connect(process.env.DBURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// read data
const users = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const posts = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/posts.json`, "utf-8")
);

// import data into db
const importData = async () => {
	try {
		await UserModel.create(users);
		await PostModel.create(posts);
		console.log("Data seeded...");
		process.exit();
	} catch (error) {
		console.log(error);
	}
};

// delete everything from db
const deleteData = async () => {
	try {
		// next level of DROP * FROM *;
		await UserModel.deleteMany();
		await PostModel.deleteMany();

		console.log("Data deleted...");
		process.exit();
	} catch (error) {
		console.log(error);
	}
};

if (process.argv[2] === "-i") {
	importData();
} else if (process.argv[2] === "-d") {
	deleteData();
}
