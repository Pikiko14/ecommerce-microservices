import { Response } from "express";
import { Utils } from "../utils/utils";
import messageBroker from "../utils/messageBroker";
import { User } from "../interfaces/users.interface";
import { ResponseHandler } from "../utils/responseHandler";
import UserRepository from "../repositories/user.repository";
import { MessageBrokerInterface, TypeNotification } from "../interfaces/broker.interface";

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
      await this.update(user.id, user);

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
      throw error.message;
    }
  }

  /**
   * User confirmation
   */
  public async userConfirmation(
    res: Response,
    token: string,
    action: string
  ): Promise<void> {
    try {
      // get user and validate
      const user: any = await this.getUserByConfirmationToken(token);

      // validate action
      let message: string = "";

      // unsuscribe
      if (user && user.id && action === "unsubscribe") {
        await this.deleteUser(user.id);
        message = "User unsubscribe correctly";
      }

      // do user confirmation
      if (user && user.id && action === "confirm-account" && user.confirmation_token === token) {
        const verifyToken = await this.utils.verifyToken(token)
        if (verifyToken) {
          user.is_active = true;
          user.confirmation_token = null;
          await this.update(user.id, user);
          message = "User confirmed correctly";
        } else {
          await this.deleteUser(user.id);
          message = "Token expired, user confirmation failed";
        }
      }

      // return response
      return ResponseHandler.successResponse(res, user, message);
    } catch (error: any) {
      throw error.message;
    }
  }
}

export { AuthService };
