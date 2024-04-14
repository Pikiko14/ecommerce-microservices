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
    return await this.model.findOne({ username });
  }

  /**
   * Get User by email
   * @param email String
   */
  public async getUserByEmail(email: string): Promise<User | void | null> {
    return await this.model.findOne({ email });
  }

  /**
   * Save user in bbdd
   * @param user User
   */
  public async create (user: User): Promise<User> {
    const userBd = await this.model.create(user);
    return userBd;
  }
}

export default UserRepository;
