import amqp, { Channel, Connection } from "amqplib";
import configuration from "../../configuration/configuration";

/**
 * Clase encargada de interactuar con el broker de mensajes RabbitMQ.
 * Ofrece métodos para publicar y consumir mensajes.
 */
class MessageBroker {
  private channel: Channel | null;

  /**
   * Constructor de la clase.
   */
  constructor() {
    this.channel = null;
  }

  /**
   * Conecta al broker de mensajes RabbitMQ.
   */
  async connect(): Promise<void> {
    console.log("Connecting to RabbitMQ...");
    setTimeout(async () => {
      try {
        const connection: Connection = await amqp.connect(configuration.get('RABITMQ_URL') || "amqp://localhost");
        this.channel = await connection.createChannel();
        await this.channel.assertQueue(configuration.get('BROKER_CHANNEL') || "notifications");
        console.log("RabbitMQ connected");

        // Configurar prefetch
        this.channel.prefetch(1); // Solo procesa un mensaje a la vez
      } catch (err: any) {
        console.error("Failed to connect to RabbitMQ:", err.message);
        // Manejo de errores y reconexión
      }
    }, 0); // delay 3 seconds to wait for RabbitMQ to start
  }

  /**
   * Publica un mensaje en el broker de mensajes.
   * @param queue Nombre de la cola donde se publicará el mensaje
   * @param message Contenido del mensaje a publicar
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
      console.log("Message published successfully:", message);
    } catch (err) {
      console.error("Failed to publish message:", err);
    }
  }

  /**
   * Consume un mensaje del broker de mensajes.
   * @param queue Nombre de la cola desde donde se consumirá el mensaje
   * @param callback Función a la que se le pasará el contenido del mensaje
   */
  async consumeMessage(queue: string, callback: (message: any) => void): Promise<void> {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.consume(queue, async (message) => {
        if (message) {
          const content = message.content.toString();
          const parsedContent = JSON.parse(content);
          try {
            await callback(parsedContent);
            this.channel!.ack(message); // Reconocer el mensaje después de procesarlo correctamente
          } catch (error) {
            console.error("Error handling message:", error);
            this.channel!.nack(message); // Reconocer el mensaje como no entregado para que sea procesado nuevamente
          }
        }
      });
    } catch (err) {
      console.error("Error consuming message:", err);
      // Manejo de errores y reconexión
    }
  }
}

export default new MessageBroker();

