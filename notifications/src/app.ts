import messageBroker from './utils/messageBroker';
import configuration from '../configuration/configuration';
import notificationService from './services/notification.service';
import { MessageBrokerInterface } from './interfaces/broker.interface';

/**
 * Clase encargada de consumir mensajes del broker de RabbitMQ
 */
class NotificationConsumer {

  /**
   * Conecta al broker y se suscribe a la cola de notificaciones
   */
  async connectToRabbitMQ(): Promise<void> {
    await messageBroker.connect();
    setTimeout(async () => {
      await this.startConsuming();
    }, 1500);
  }

  /**
   * Inicia el consumo de mensajes de la cola de notificaciones
   */
  async startConsuming(): Promise<void> {
    messageBroker.consumeMessage(configuration.get('BROKER_CHANNEL') || "notifications", async (message: MessageBrokerInterface) => {
      try {
        // get message data
        const { type_notification } = message;
        // Procesar el mensaje según el tipo de notificación
        await notificationService.sendMessage(type_notification, message);
      } catch (error) {
        console.error("Error processing message:", error);
        // Manejar el error según sea necesario
      }
    });
  }
}

// Inicia el consumidor de notificaciones
const broker = new NotificationConsumer();
broker.connectToRabbitMQ();
