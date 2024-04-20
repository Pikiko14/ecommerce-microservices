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
        await this.channel.assertQueue(configuration.get('BROKER_CHANNEL') || "auth");
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
