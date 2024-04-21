import { MessageSender } from "../../interfaces/notification.interface";

/**
 * Clase encargada de enviar mensajes por WhatsApp.
 */
export class WhatsAppSender implements MessageSender {
  /**
   * Envía un mensaje por WhatsApp.
   * @param message Contenido del mensaje a enviar
   */
  async sendMessage(message: string): Promise<void> {
    // Lógica para enviar mensaje por WhatsApp
    console.log("Sending WhatsApp message:", message);
  }
}
