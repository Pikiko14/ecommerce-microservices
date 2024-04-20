import amqp, { Channel, Connection } from "amqplib";

class MessageBroker {
  private channel: Channel | null;

  constructor() {
    this.channel = null;
  }

  async connect(): Promise<void> {
    console.log("Connecting to RabbitMQ...");

    setTimeout(async () => {
      try {
        const connection: Connection = await amqp.connect("amqp://localhost");
        this.channel = await connection.createChannel();
        await this.channel.assertQueue("notifications");
        console.log("RabbitMQ connected");
      } catch (err: any) {
        console.error("Failed to connect to RabbitMQ:", err.message);
      }
    }, 20000); // delay 20 seconds to wait for RabbitMQ to start
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