const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	// mongoose bad object id
	if (err.name === "CastError") {
		const message = `Resource not found with the id ${err.value}`;
		error = new ErrorResponse(message, 404);
	}

	// mongoose duplicate field error
	if (err.code === 11000) {
		const message = `Duplicate value entered`;
		error = new ErrorResponse(message, 409);
	}

	// mongoose validation error
	if (err.name === "ValidationError") {
		console.log("here");
		const message = Object.values(err.errors).map((val) => val.message);
		error = new ErrorResponse(message, 409);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Server Error",
	});
};

module.exports = errorHandler;
