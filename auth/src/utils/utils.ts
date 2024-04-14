import fs from "fs";
import * as crypto from "crypto";
import * as bcrypt from "bcryptjs";
import moment, { DurationInputArg1 } from "moment";
import { sign, verify } from "jsonwebtoken";
import { User } from "../interfaces/users.interface";

class Utils {
  JWT_SECRET: string = "";
  salt: number = 0;
  path: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || "";
    this.salt = 10;
    this.path = `${process.cwd()}/uploads/`;
  }

  /**
   * split file by delimiter
   * @param {string} file
   * @param {string} delimiter
   * @returns {string}
   */
  splitFile(file: string, delimiter: string): string {
    const nameFile: string = file.split(delimiter).shift() as string;
    return nameFile;
  }

  /**
   * generate sesion token.
   * @param {string} id
   * @param {string} name
   */
  generateToken = async ({ name, scopes, _id, role, last_name, email }: User) => {
    const jwt = await sign({ _id, name, scopes, parent, role, last_name, email }, this.JWT_SECRET, {
      expiresIn: "1d",
    });
    return jwt;
  };

  /**
   * verify session token
   * @param {string} token
   */
  verifyToken = async (token: string) => {
    const isOk = await verify(token, this.JWT_SECRET);
    return isOk;
  };

  /**
   * Generate password encrypt
   * @param {string} password
   */
  encryptPassword = async (password: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(password, this.salt);
    return hashedPassword;
  };

  /**
   * Comapre user password
   * @param {string} userPassword user bd password
   * @param {string} loginPassword // form password
   */
  comparePassword = async (
    userPassword: string,
    loginPassword: string
  ): Promise<boolean> => {
    const compare = await bcrypt.compare(loginPassword, userPassword);
    if (!compare) return false;
    return true;
  };

  /**
   * Get current date
   */
  getCurrentDate = (): string => {
    const currentDate = new Date();
    // Get the day, month, and year
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    // Format the date in "dd-mm-yyyy" format
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  /**
   * Format date to YYYY-MM-DD
   * @param {Date} date
   */
  formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  /**
   * get path from storage
   * @param {string} path
   */
  getPath = async (path: string): Promise<string | undefined> => {
    if (path.includes("catalogues")) {
      await this.validateOrGeneratePath("catalogues");
      return "catalogues";
    }
    if (path.includes("pdf")) {
      await this.validateOrGeneratePath("pdfs");
      return "pdfs";
    }
    if (path.includes("images")) {
      await this.validateOrGeneratePath(path);
      return path;
    }
    if (path.includes("pages")) {
      await this.validateOrGeneratePath("images");
      return "images";
    }
    if (path.includes("profile")) {
      await this.validateOrGeneratePath("profile");
      return "profile";
    }
    if (path.includes("products")) {
      await this.validateOrGeneratePath("products");
      return "products";
    }
    if (path.includes("categories")) {
      await this.validateOrGeneratePath("categories");
      return "categories";
    }
    return undefined;
  };

  validateOrGeneratePath = async (path: string): Promise<void> => {
    const directory = `${this.path}/${path}`;
    const isDirectoryExist = await fs.existsSync(directory);
    if (!isDirectoryExist) {
      fs.mkdirSync(directory);
    }
  };

  /**
   * Delete file from storage
   * @param {string} path
   */
  deleteItemFromStorage = async (path: string) => {
    const directory = `${this.path}/${path}`;
    const isDirectoryExist = await fs.existsSync(directory);
    if (isDirectoryExist) {
      await fs.unlinkSync(directory);
    }
  };

  /**
   * Generate date
   * @returns { string }
   */
  getDate = () => {
    const now: any = moment().format("YYYY-MM-DD HH:mm:ss");
    return now;
  };

  /**
   * Get date from string
   * @param {string} date
   * @returns { string }
   */
  getDateFromString = (date: string | Date) => {
    const now: any = moment(date).format("YYYY-MM-DD HH:mm:ss");
    return now;
  };

  /**
   * add some time to current date
   * @param { Date } date
   * @param { string } typeAdd
   * @param { string } timeToAdd
   */
  sumTimeToDate = (date: Date, typeAdd: any, timeToAdd: any) => {
    const currentDate: moment.Moment = moment(date);
    // Add one day to the current date
    const futureDate: moment.Moment = currentDate.add(timeToAdd, typeAdd);
    const dateReturn: any = futureDate.format("YYYY-MM-DD HH:mm:ss");
    return dateReturn;
  };

  /**
   * do hash for epayco
   * @param { string } chainText
   */
  doHash = async (chainText: string): Promise<string | void> => {
    const signature: string = await crypto
      .createHash("sha256")
      .update(chainText)
      .digest("hex");
    return signature;
  };

  /**
   * generate token for recovery password.
   * @param {string} id
   * @param {string} name
   */
  generateTokenForRecoveryPassword = async ({ email }: any) => {
    const jwt = await sign({ email }, this.JWT_SECRET, {
      expiresIn: "30m",
    });
    return jwt;
  };
}

export { Utils };
