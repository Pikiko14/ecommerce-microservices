import { MessageSender } from "../../interfaces/notification.interface";

/**
 * Clase encargada de enviar mensajes por SMS
 */
export class SmsSenderService implements MessageSender {
  /**
   * Envía un mensaje por SMS
   * @param message Contenido del mensaje a enviar
   */
  async sendMessage(message: string): Promise<void> {
    // Lógica para enviar mensaje por SMS
    console.log("Sending SMS:", message);
  }
}
