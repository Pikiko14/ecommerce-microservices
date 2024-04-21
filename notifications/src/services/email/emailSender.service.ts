import { MessageSender } from "../../interfaces/notification.interface";

/**
 * Clase encargada de enviar mensajes por correo electrónico
 */
export class EmailSenderService implements MessageSender {
  /**
   * Envía un mensaje por correo electrónico
   * @param message Contenido del mensaje a enviar
   */
  async sendMessage(message: string): Promise<void> {
    // Lógica para enviar mensaje por correo electrónico
    console.log("Sending email:", message);
  }
}
