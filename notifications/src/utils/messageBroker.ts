import amqp, { Channel, Connection } from "amqplib";
import configuration from "../../configuration/configuration";

/**
 * Clase encargada de manejar la comunicación con RabbitMQ.
 */
class MessageBroker {
  /**
   * Canal de comunicación con RabbitMQ.
   */
  private channel: Channel | null;

  /**
   * Constructor de la clase.
   */
  constructor() {
    this.channel = null;
  }

  /**
   * Método asíncrono que se conecta a RabbitMQ.
   */
  async connect(): Promise<void> {
    console.log("Connecting to RabbitMQ...");

    setTimeout(async () => {
      try {
        const connection: Connection = await amqp.connect(configuration.get('RABITMQ_URL') || "amqp://localhost");
        this.channel = await connection.createChannel();
        await this.channel.assertQueue(configuration.get('BROKER_CHANNEL') || "notifications");
        console.log("RabbitMQ connected");
      } catch (err: any) {
        console.error("Failed to connect to RabbitMQ:", err.message);
      }
    }, 3000); // delay 3 seconds to wait for RabbitMQ to start
  }

  /**
   * Método asíncrono que publica un mensaje en la cola.
   * @param queue Nombre de la cola.
   * @param message Objeto a publicar.
   */
  async publishMessage(queue: string, message: any): Promise<void> {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message))
      );
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Método asíncrono que consume un mensaje de la cola.
   * @param queue Nombre de la cola.
   * @param callback Función a ejecutar cuando se reciba un mensaje.
   */
  async consumeMessage(queue: string, callback: (message: any) => void): Promise<void> {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.consume(queue, (message) => {
        if (message) {
          const content = message.content.toString();
          const parsedContent = JSON.parse(content);
          callback(parsedContent);
          this.channel!.ack(message);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new MessageBroker();
