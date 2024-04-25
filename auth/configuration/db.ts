import { connect, Connection } from "mongoose";
import config from "./configuration";

class Database {
  private readonly DB_URI: string;
  private connection: Connection | any;

  constructor() {
    this.DB_URI = config.get('APP_ENV') === 'develop' ? config.get('DB_URL') : config.get('MONGO_ATLAS_URL')!;
    this.connection = null;
  }

  public async connect(): Promise<void> {
    try {
      this.connection = await connect(this.DB_URI) as unknown as Connection;;
      console.log("Conexión a la base de datos establecida correctamente.");
    } catch (error) {
      console.error("Error al conectar con la base de datos:", error);
      throw error; // Lanzar el error para que el usuario pueda manejarlo
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.disconnect();
        console.log("Conexión a la base de datos cerrada correctamente.");
      }
    } catch (error) {
      console.error("Error al cerrar la conexión con la base de datos:", error);
      throw error; // Lanzar el error para que el usuario pueda manejarlo
    }
  }
}

export default Database;
