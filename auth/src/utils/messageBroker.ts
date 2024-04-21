import amqp, { Channel, Connection } from "amqplib";
import configuration from "../../configuration/configuration";
import { MessageBrokerInterface } from "../interfaces/broker.interface";

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

        // Configurar parámetros de la cola
        const queueOptions: any = {
          durable: true, // asegurar que la cola sea durable
          // maxLength: parseInt(configuration.get('MAX_QUEUE_MESSAGES')) || undefined, // límite máximo de mensajes en cola
          // maxBytes: parseInt(configuration.get('MAX_QUEUE_BYTES')) || undefined, // límite máximo de tamaño de la cola
          // messageTtl: configuration.get('MESSAGE_TTL') || undefined, // tiempo de expiración de los mensajes
          // expires: configuration.get('QUEUE_EXPIRATION') || undefined, // tiempo de expiración de la cola
          // deadLetterExchange: configuration.get('DLX_EXCHANGE') || undefined, // intercambio de cola de errores
          // deadLetterRoutingKey: configuration.get('DLX_ROUTING_KEY') || undefined, // clave de enrutamiento de cola de errores
          // más opciones de configuración según sea necesario
        };

        await this.channel.assertQueue(configuration.get('BROKER_CHANNEL') || "auth", queueOptions);

        console.log("RabbitMQ connected");
      } catch (err: any) {
        console.error("Failed to connect to RabbitMQ:", err.message);
      }
    }, 3000); // delay 3 seconds to wait for RabbitMQ to start
  }

  /**
   * Publica un mensaje en el broker de mensajes.
   * @param queue Nombre de la cola donde se publicará el mensaje
   * @param message Contenido del mensaje a publicar
   */
  async publishMessage(queue: string, message: MessageBrokerInterface): Promise<void> {
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

export default new MessageBroker(); // Instancia única de la clase

