import { NotificationSenderInterface } from "../../interfaces/notification.interface";
import { MessageBrokerInterface } from "../../interfaces/broker.interface";

/**
 * Clase encargada de enviar mensajes por correo electrónico
 */
export class EmailSenderService implements NotificationSenderInterface {
  /**
   * Envía un mensaje por correo electrónico
   * @param message Contenido del mensaje a enviar
   */
  async sendMessage(message: MessageBrokerInterface): Promise<void> {
    // Lógica para enviar mensaje por correo electrónico
    console.log("Sending email:", message);
  }
}
