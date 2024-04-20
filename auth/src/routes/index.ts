/**
 * @class RoutesIndex
 * @description This class is responsible for loading all routes in the application
 * @author Johnny Ray Ramirez <jramirez-dev@hotmail.com>
 */
import { Router } from "express";
import { readdirSync } from "fs";
import { Utils } from "../utils/utils";

class RoutesIndex {
  /**
   * The express router
   */
  public readonly router: Router;
  /**
   * The path of the router
   */
  private readonly PATH_ROUTER: string;
  /**
   * The utilities class
   */
  private utils: Utils;

  /**
   * Constructor of the class
   */
  constructor() {
    this.router = Router();
    this.PATH_ROUTER = `${__dirname}`;
    this.utils = new Utils();
  }

  /**
   * Function that loads all routes
   */
  public async loadRoutes(): Promise<void> {
    readdirSync(this.PATH_ROUTER).filter((fileName) => {
      if (fileName !== "index.ts") {
        const nameFile = this.utils.splitFile(fileName, ".");
        import(`./${nameFile}.routes`).then((moduleRouter) => {
          console.log(`Loading ${nameFile} routers`);
          this.router.use(`/`, moduleRouter.router);
        });
      }
    });
  }

  /**
   * Function that returns the router
   */
  public getRouter(): Router {
    return this.router;
  }
}

export default RoutesIndex;

