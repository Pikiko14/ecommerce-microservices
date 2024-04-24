import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { AuthService } from "../services/auth.service";
import { User } from "../interfaces/users.interface";
import { matchedData } from 'express-validator';
import { ResponseRequestInterface } from "../interfaces/response.interface";

export class AuthController {
  public service;

  constructor() {
    this.service = new AuthService()
  }

  /**
   * Register new user
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  register = async (req: Request, res: Response): Promise<void | User | null>  => {
    try {
      const body = matchedData(req) as User;
      return await this.service.registerUser(res, body);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }

  /**
   * Confirm user
   * @param req Express request
   * @param res Express response
   */
  userConfirmation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, action } = req.query as any;
      await this.service.userConfirmation(res, token, action);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }

  /**
   * Confirm user
   * @param req Express request
   * @param res Express response
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = matchedData(req) as User;
      await this.service.login(res, body);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, 'Error on login');
    }
  }

  /**
   * Recovery password
   * @param req Express request
   * @param res Express response
   */
  recovery = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = matchedData(req) as User;
      await this.service.recovery(res, body);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, 'Error on recovery users');
    }
  }

  /**
   * change password
   * @param req Express request
   * @param res Express response
   */
  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = matchedData(req) as User;
      await this.service.changePassword(res, body);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, 'Error on change password');
    }
  }
}
