import Server from "http-proxy";
import { createServer } from "http-proxy";
import configuration from "./../configuration/configuration" 
import express, { Request, Response, Application } from "express";

class APIGateway {
  private proxy: Server;
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.proxy = createServer();
    this.port = parseInt(configuration.get("PORT")) || 3000;
  }

  public start(): void {
    // Route requests to the auth service
    this.app.use("/api/v1/auth", (req: Request, res: Response) => {
      this.proxy.web(req, res, { target: configuration.get("AUTH_URL") });
    });

    // Start the server
    this.app.listen(this.port, () => {
      console.log(`API Gateway listening on port ${this.port}`);
    });
  }
}

try {
    // Instanciar y empezar el servidor
  const gateway = new APIGateway();
  gateway.start();
} catch (error) {
  console.log(error)
}
