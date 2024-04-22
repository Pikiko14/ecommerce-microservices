import { Model } from "mongoose";
import UserModel from "../models/users.model";
import { User } from "../interfaces/users.interface";

class UserRepository {
  private readonly model: Model<User>;

  constructor() {
    this.model = UserModel;
  }

  /**
   * Get User by Username
   * @param username String
   */
  public async getUserByUsername(username: string): Promise<User | void | null> {
    return await this.model.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });
  }

  /**
   * Get User by email
   * @param email String
   */
  public async getUserByEmail(email: string): Promise<User | void | null> {
    return await this.model.findOne({ email });
  }

  /**
   * Get User by email
   * @param token String
   */
  public async getUserByConfirmationToken(token: string): Promise<User | void | null> {
    return await this.model.findOne({ confirmation_token: token });
  }

  /**
   * delete user
   */
  public async deleteUser(id: string): Promise<User | void | null> {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * Save user in bbdd
   * @param user User
   */
  public async create (user: User): Promise<User> {
    const userBd = await this.model.create(user);
    return userBd;
  }

  /**
   * Update user data
   * @param id
   * @param body
   */
  public async update (id: string, body: User): Promise<User | void | null> {
    return await this.model.findByIdAndUpdate(id, body);
  }
}

export default UserRepository;
