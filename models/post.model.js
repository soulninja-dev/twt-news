const mongoose = require("mongoose");

// describes the structure of the documents that we are going to store in the collection.
const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, "Please add a title"],
			maxlength: [50, "Title can't be more than 50 characters"],
		},
		subtitle: {
			type: String,
			required: [true, "Please add a subtitle"],
			maxlength: [50, "Subtitle can't be more than 50 characters"],
		},
		body: {
			type: String,
			required: [true, "Please add a body"],
			maxlength: [5000, "Body can't be more than 5000 characters"],
		},
		author: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "Please add an author id"],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("posts", postSchema);
