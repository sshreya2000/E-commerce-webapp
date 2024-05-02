export class ApplicationError extends Error {
  constructor(statusCode, errMessage) {
    super(errMessage);
    this.statusCode = statusCode;
  }
}

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof ApplicationError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
  } else {
    res.status(500).json({
      success: false,
      message: "Oops! Something went wrong... Please try again later!",
    });
  }
  next();
};
export default errorHandlerMiddleware;
