const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: [true, "Please add a name"],
		unique: true,
		maxlength: [50, "Name can not be more than 50 characters"],
	},
	email: {
		type: String,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"Please add a valid email",
		],
	},
	password: {
		type: String,
		required: [true, "Please add a password"],
	},
});

userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			// passwords have matched :thumbsup:
			return user;
		}
		throw Error("incorrect email/password");
	}
	throw Error("incorrect email/password");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
