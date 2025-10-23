import { logger } from "../utils/logger.util.js";

export const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  } else {
    logger.log({ level: "error", message: err.message });
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
    return;
  }
};
