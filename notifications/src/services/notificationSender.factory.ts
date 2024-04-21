import { SmsSenderService } from "./sms/smsSender.service";
import { EmailSenderService } from "./email/emailSender.service";
import { TypeNotification } from "../interfaces/broker.interface";
import { WhatsAppSender } from "./whatsapp/whatsappSender.service";
import { MessageSender } from "../interfaces/notification.interface";

/**
 * Clase que crea objetos de envío de mensajes
 */
export class NotificationSenderFactory {
  /**
   * Crea un objeto de envío de mensajes según el tipo de mensaje
   * @param type Tipo de mensaje (email, sms o whatsapp)
   * @returns Objeto de envío de mensajes
   */
  static createSender(type: TypeNotification): MessageSender {
    switch (type) {
      case TypeNotification.EMAIL:
        return new EmailSenderService();

      case TypeNotification.SMS:
        return new SmsSenderService();

    case TypeNotification.WHATSAPP:
        return new WhatsAppSender();

    default:
        throw new Error("Invalid message sender type");
    }
  }
}
