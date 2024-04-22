import { Response } from "express";
import { Utils } from "../utils/utils";
import messageBroker from "../utils/messageBroker";
import { User } from "../interfaces/users.interface";
import { ResponseHandler } from "../utils/responseHandler";
import UserRepository from "../repositories/user.repository";
import { MessageBrokerInterface, TypeNotification } from "../interfaces/broker.interface";
import { Model } from "mongoose";

class AuthService extends UserRepository {
  private utils: Utils;

  constructor() {
    super();
    this.utils = new Utils();
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
      // set password
      body.password = await this.utils.encryptPassword(body.password);

      // create user on bbdd
      const user: any = await this.create(body);

      // set token recovery valid by 1d
      user.confirmation_token = await this.utils.generateToken(user);
      await user.save();

      // push notification queueue
      const message: MessageBrokerInterface = {
        data: user,
        type_notification: TypeNotification.EMAIL,
        template: "welcome",
      }
      await messageBroker.publishMessage('notifications', message);

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
