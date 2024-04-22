import { Logger, createLogger, transports, format } from "winston";
import { NotificationSenderFactory } from "./notificationSender.factory";
import { MessageBrokerInterface, TypeNotification } from "../interfaces/broker.interface";

/**
 * Servicio encargado de enviar notificaciones
 */
class NotificationService {
  private logger: Logger = createLogger({
    level: "error",
    transports: [
      new transports.Console(),
      new transports.File({ filename: "error.log", level: "error" }),
    ],
    format: format.combine(format.timestamp(), format.json()),
  });

  /**
   * Envía un mensaje por el medio indicado
   * @param type Tipo de mensaje (email, sms o whatsapp)
   * @param message Contenido del mensaje a enviar
   */
  async sendMessage(type: TypeNotification, message: MessageBrokerInterface): Promise<void> {
    try {
      const sender = NotificationSenderFactory.createSender(type);
      const email = await sender.sendMessage(message);
      console.log(`Notification send success with type ${type}`);
    } catch (error: any) {
      this.logger.error(error.message, { error }); // Registrar el error en los registros de Winston
      throw new Error('Failed to send message');
    }
  }
}

export default new NotificationService();

