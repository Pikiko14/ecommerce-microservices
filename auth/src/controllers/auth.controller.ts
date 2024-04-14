import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { AuthService } from "../services/auth.service";
import { User } from "../interfaces/users.interface";
import { matchedData } from 'express-validator';

export class AuthController {
  public service;

  constructor() {
    this.service = new AuthService()
  }

  /**
   * Register new user
   * @param req Express request
   * @param res Express response
   * @returns Promise<LoginReturn>
   */
  register = async (req: Request, res: Response): Promise<void | User | null>  => {
    try {
      const body = matchedData(req);
      return await this.service.registerUser(res, req.body);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }
}
