/**
 * Main application file for the API
 */

// Imports
import express, { Application, Router } from 'express';
import cors, { CorsOptions } from 'cors';
import RoutesIndex from './routes';
import path from 'path';
import configuration from '../configuration/configuration';
import Database from '../configuration/db';
import { router } from './../../../smartCatalog/src/routes/catalogues';

// Classes
/**
 * The main application class
 */
export class Server {
  /** The Express application */
  private app: Application;
  /** The port the server should run on */
  private readonly PORT: number | string;
  /** The path to the public directory */
  private readonly publicDirectoryPath: string;
  /** The path to the route directory */
  private readonly routeDirectoryPath: string;

  /**
   * Creates a new instance of the server
   */
  constructor() {
    this.app = express();
    this.PORT = parseInt(configuration.get('PORT')) || 3000; // Default port
    this.publicDirectoryPath = path.join(__dirname, '../uploads');
    this.routeDirectoryPath = path.join(__dirname, './routes'); // Path to your routes directory
  }

  /**
   * Configures the middleware for the Express application
   */
  private configureMiddleware(): void {
    const corsOptions: CorsOptions = {
      origin: [
        'http://localhost:9000',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      optionsSuccessStatus: 204,
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.loadRoutes();
    this.app.use(express.static(this.publicDirectoryPath));
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
