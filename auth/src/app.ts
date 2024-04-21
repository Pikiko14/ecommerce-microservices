/**
 * Main application file for the API
 */

// Imports
import path from 'path';
import RoutesIndex from './routes';
import cors, { CorsOptions } from 'cors';
import Database from '../configuration/db';
import express, { Application } from 'express';
import messageBroker from './utils/messageBroker';
import configuration from '../configuration/configuration';

// Classes
/**
 * The main application class
 */
export class Server {
  /** The Express application */
  private app: Application;
  /** The port the server should run on */
  private readonly PORT: number | string;
  /** The path to the route directory */
  private readonly routeDirectoryPath: string;

  /**
   * Creates a new instance of the server
   */
  constructor() {
    this.app = express();
    this.setupMessageBroker();
    this.PORT = parseInt(configuration.get('PORT')) || 3000; // Default port
    this.routeDirectoryPath = path.join(__dirname, './routes'); // Path to your routes directory
  }

  /**
   * Configures the middleware for the Express application
   */
  private configureMiddleware(): void {
    const corsOptions: CorsOptions = {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      optionsSuccessStatus: 204,
    };
    this.app.use(express.json());
    this.loadRoutes();
    this.app.use(cors(corsOptions));
  }

  /**
   * Loads the routes for the application
   */
  private loadRoutes(): void {
    // Use the router
    const routes = new RoutesIndex();
    routes.loadRoutes();
    this.app.use(routes.getRouter());
  }

  /**
   * Set message broker
   */
  setupMessageBroker(): void {
    messageBroker.connect();
  }

  /**
   * Starts the server
   */
  private async startServer(): Promise<void> {
      const db = new Database();
      await db.connect();
    this.app.listen(this.PORT, () => console.log(`Running on port ${this.PORT}`));
  }

  /**
   * Starts the server
   */
  public async start(): Promise<void> {
    this.configureMiddleware();
    await this.startServer();
  }
}

// Start the server
const server = new Server();
server.start();
