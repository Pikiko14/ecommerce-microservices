import { check } from "express-validator";
import { Request, Response, NextFunction } from "express";
import UserRepository from "../repositories/user.repository";
import { handlerValidator } from "../utils/handler.validator";

// instanciate all class neccesaries
const repository = new UserRepository();

// build validators

const RegisterValidator = [
  check("username")
    .exists()
    .withMessage("Username does not exist")
    .notEmpty()
    .withMessage("Username is empty")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 5, max: 90 })
    .withMessage("Username must have a minimum of 5 characters")
    .custom(async (username: string) => {
      const existUser = await repository.getUserByUsername(username);
      if (existUser) {
        throw new Error("Username exist in our records");
      }
      return true;
    }),
  check("password")
    .exists()
    .withMessage("Password is empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[$@#&!*-]/)
    .withMessage(
      "Password must contain at least one special character like $, @, #, &, - or !"
    ),
  check("name")
    .exists()
    .withMessage("name does not exist")
    .notEmpty()
    .withMessage("name is empty")
    .isString()
    .withMessage("name must be a string")
    .isLength({ min: 4, max: 90 })
    .withMessage("name must have a minimum of 4 characters and maximum 90"),
  check("last_name")
    .exists()
    .withMessage("Last name dost not exist")
    .notEmpty()
    .withMessage("Last name is empty")
    .isString()
    .withMessage("Last name must be a string")
    .isLength({ min: 3, max: 90 })
    .withMessage("Last name must have a minimum of 3 characters"),
  check("email")
    .exists()
    .withMessage("Email does not exist")
    .notEmpty()
    .withMessage("Email is empty")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Invalid email format")
    .isLength({ min: 5, max: 90 })
    .withMessage("Email must have a minimum of 5 characters")
    .custom(async (email: string) => {
      const existEmail = await repository.getUserByEmail(email);
      if (existEmail) {
        throw new Error("Email exist in our records");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

const ConfirmationUserValidator = [
  check("action")
  .exists()
    .withMessage("Action is required")
    .notEmpty()
    .withMessage("Action is empty")
    .isString()
    .withMessage("Action must be a string"),
  check("token")
    .exists()
    .withMessage("Token is required")
    .notEmpty()
    .withMessage("Token is empty")
    .isString()
    .withMessage("Token must be a string")
    .custom(async (token: string) => {
      const existToken = await repository.getUserByConfirmationToken(token);
      if (!existToken) {
        throw new Error("Token don't exist in our records");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

export {
  RegisterValidator,
  ConfirmationUserValidator
};
