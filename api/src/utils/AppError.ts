import { StatusCode } from "hono/utils/http-status";

class AppError extends Error {
	statusCode: StatusCode;
	isOperational: boolean;
	error: Error;

	constructor(message: string, statusCode: StatusCode, error: Error) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;
		this.error = error;
		console.log(error)

		Error.captureStackTrace(this, this.constructor);
	}
}

export default AppError;
