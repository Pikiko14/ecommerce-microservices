import { NotificationSenderInterface } from "../../interfaces/notification.interface";
import { MessageBrokerInterface } from "../../interfaces/broker.interface";

/**
 * Clase encargada de enviar mensajes por WhatsApp.
 */
export class WhatsAppSender implements NotificationSenderInterface {
  /**
   * Envía un mensaje por WhatsApp.
   * @param message Contenido del mensaje a enviar
   */
  async sendMessage(message: MessageBrokerInterface): Promise<void> {
    // Lógica para enviar mensaje por WhatsApp
    console.log("Sending WhatsApp message:", message);
  }
}
