import dotenv from 'dotenv';

class Configuration {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    // Cargar las variables de entorno desde el archivo .env
    dotenv.config();
    this.envConfig = process.env as any;
  }

  public get(key: string): string {
    // Obtener el valor de una variable de entorno específica
    return this.envConfig[key];
  }
}

// Exportar una instancia única del objeto Configuration
export default new Configuration();
