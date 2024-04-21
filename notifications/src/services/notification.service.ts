import winston from 'winston';
import { NotificationSenderFactory } from "./notificationSender.factory";
import { MessageBrokerInterface, TypeNotification } from "../interfaces/broker.interface";

/**
 * Servicio encargado de enviar notificaciones
 */
class NotificationService {
  /**
   * Envía un mensaje por el medio indicado
   * @param type Tipo de mensaje (email, sms o whatsapp)
   * @param message Contenido del mensaje a enviar
   */
  async sendMessage(type: TypeNotification, message: MessageBrokerInterface): Promise<void> {
    try {
        const sender = NotificationSenderFactory.createSender(type);
        await sender.sendMessage(message);
      } catch (error: any) {
        winston.error(`Failed to send message: ${error.message}`);
        throw new Error('Failed to send message');
      }
  }
}

export default new NotificationService();

