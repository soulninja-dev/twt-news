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
		subbody: {
			type: String,
		},
		author: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "Please add an author id"],
		},
		html: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

postSchema.pre("save", function (next) {
	if (this.body.length > 50) {
		this.subbody = this.body.substring(0, 47) + "...";
	} else {
		this.subbody = this.body.substring(0, this.body.length - 3) + "...";
	}

	next();
});

module.exports = mongoose.model("posts", postSchema);
