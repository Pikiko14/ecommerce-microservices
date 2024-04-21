import amqp, { Channel, Connection } from "amqplib";
import configuration from "../../configuration/configuration";

class MessageBroker {
  private channel: Channel | null;

  constructor() {
    this.channel = null;
  }

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
