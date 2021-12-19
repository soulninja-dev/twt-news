const mongoose = require("mongoose");

// describes the structure of the documents that we are going to store in the collection.
const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, "Please add a title"],
		},
		subtitle: {
			type: String,
			required: [true, "Please add a subtitle"],
		},
		body: {
			type: String,
			required: [true, "Please add a body"],
		},
		author: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("posts", postSchema);
