import { SmsSenderService } from "./sms/smsSender.service";
import { EmailSenderService } from "./email/emailSender.service";
import { WhatsAppSender } from "./whatsapp/whatsappSender.service";
import { MessageSender } from "../interfaces/notification.interface";

/**
 * Clase que crea objetos de envío de mensajes
 */
export class MessageSenderFactory {
  /**
   * Crea un objeto de envío de mensajes según el tipo de mensaje
   * @param type Tipo de mensaje (email, sms o whatsapp)
   * @returns Objeto de envío de mensajes
   */
  static createSender(type: string): MessageSender {
    switch (type) {
      case "email":
        return new EmailSenderService();

      case "sms":
        return new SmsSenderService();

    case "whatsapp":
        return new WhatsAppSender();

    default:
        throw new Error("Invalid message sender type");
    }
  }
}
