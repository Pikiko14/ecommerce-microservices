/**
 * Main application file for the API
 */

// Imports
import express, { Application } from 'express';
import messageBroker from './utils/messageBroker';

// Classes
/**
 * The main application class
 */
export class Server {
  /** The Express application */
  private app: Application;
  /** The port the server should run on */
  private readonly PORT: number | string;

  /**
   * Creates a new instance of the server
   */
  constructor() {
    this.app = express();
    this.PORT = parseInt(process.env.PORT || '3001');
    this.setupMessageBroker();
  }

  /**
   * Configures the middleware for the Express application
   */
  private configureMiddleware(): void {
    this.app.use(express.json());
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
