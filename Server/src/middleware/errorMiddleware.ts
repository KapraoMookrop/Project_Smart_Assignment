import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "../utils/errors/AppError.js";
import { ApiResponse } from "../module/app-models.js";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(ApiResponse.error(err.message));
  }

  console.error(err);

  return res.status(500).json(ApiResponse.error("Internal Server Error : " + err.message));
}