import { User } from "../interfaces/users.interface";
import UserRepository from "../repositories/user.repository";
import { ResponseHandler } from "../utils/responseHandler";
import { Response } from "express";

class AuthService extends UserRepository {
  constructor() {
    super();
  }

  /**
   * Register new user
   * @param resp The response object
   * @param body The body of the request
   * @returns A Promise of 1
   */
  public async registerUser(
    res: Response,
    body: User
  ): Promise<User | void | null> {
    try {
      const user = await this.create(body);
      // return data
      return ResponseHandler.createdResponse(
        res,
        user,
        "User registered correctly"
      );
    } catch (error: any) {
      throw error;
    }
  }
}

export { AuthService };
