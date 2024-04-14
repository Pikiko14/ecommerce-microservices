import { NextFunction } from "express";
import { Request, Response } from "express";
import { ResponseHandler } from "./responseHandler";
import { validationResult } from "express-validator";

export const handlerValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (error: any) {
    return ResponseHandler.handleUnprocessableEntity(
      res,
      error.array(),
      "Error request body"
    );
  }
};
