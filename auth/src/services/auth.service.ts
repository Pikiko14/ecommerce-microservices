import { Response } from "express";
import messageBroker from "../utils/messageBroker";
import { User } from "../interfaces/users.interface";
import { ResponseHandler } from "../utils/responseHandler";
import UserRepository from "../repositories/user.repository";

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
      // create user on bbdd
      const user = await this.create(body);

      // push notification queueue
      await messageBroker.publishMessage('notifications', user);

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
