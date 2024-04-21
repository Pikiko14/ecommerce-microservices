import messageBroker from './utils/messageBroker';
import configuration from '../configuration/configuration';

class NotificationConsumer {

  async connectToRabbitMQ(): Promise<void> {
    await messageBroker.connect();
    setTimeout(async () => {
    await this.startConsuming();
    }, 1500)
  }

  async startConsuming(): Promise<void> {
    messageBroker.consumeMessage(configuration.get('BROKER_CHANNEL') || "notifications", (message) => {
      console.log("Received message:", message);
      // Aquí puedes agregar la lógica para procesar el mensaje recibido
    });
  }
}

// Inicia el consumidor de notificaciones
const broker = new NotificationConsumer();
broker.connectToRabbitMQ();
