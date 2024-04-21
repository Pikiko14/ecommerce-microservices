import { NotificationSenderInterface } from "../../interfaces/notification.interface";
import { MessageBrokerInterface } from "../../interfaces/broker.interface";

/**
 * Clase encargada de enviar mensajes por SMS
 */
export class SmsSenderService implements NotificationSenderInterface {
  /**
   * Envía un mensaje por SMS
   * @param message Contenido del mensaje a enviar
   */
  async sendMessage(message: MessageBrokerInterface): Promise<void> {
    // Lógica para enviar mensaje por SMS
    console.log("Sending SMS:", message);
  }
}
