import fs from 'fs';
import nodemailer, { Transporter } from 'nodemailer';
import configuration from '../../../configuration/configuration';
import { MessageBrokerInterface } from "../../interfaces/broker.interface";
import { EmailMessageInterface, NotificationSenderInterface } from "../../interfaces/notification.interface";

/**
 * Clase encargada de enviar mensajes por correo electrónico
 */
export class EmailSenderService implements NotificationSenderInterface {
  public pathTemplates: string;
  private transporter: Transporter;
  public messageData: EmailMessageInterface;

  constructor() {
    // set transporter
    this.transporter = nodemailer.createTransport({
      service: configuration.get('EMAIL_PROVIDER') || 'Gmail',
      auth: {
        user: configuration.get('EMAIL_USER'),
        pass: configuration.get('EMAIL_PASSWORD'),
      },
    })

    // set message data
    this.messageData = {
      from: configuration.get('EMAIL_USER'), // Sender
      to: null, // Recipient
      subject: '', // Email subject
      html: '', // Email HTML content
    };

    // set path string
    this.pathTemplates = `${process.cwd()}/src/templates/emails/`;    
  }

  /**
   * Envía un mensaje por correo electrónico
   * @param message Contenido del mensaje a enviar
   */
  async sendMessage(message: MessageBrokerInterface): Promise<void> {
    try {
      // set email destination
      this.messageData.to = message.to || message.data.email;

      // set email subject
      this.messageData.subject = message.subject || message.template;

      // set email template
      this.messageData.html = await this.getTemplate(message.template, message.data);

      // send message
      await this.transporter.sendMail(this.messageData as any);
    } catch (error: any) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * get email template
   * @param template
   */
  async getTemplate(template: string, params: any): Promise<string> {
    try {
      // load html
      const html = await fs.readFileSync(
        `${this.pathTemplates}${template}.html`,
      );

      // set html content
      let htmlWithContentParse = html.toString();
      Object.keys(params).forEach(variable => {
        const regex = new RegExp(`{{\\s*${variable}\\s*}}`, 'g');
        htmlWithContentParse = htmlWithContentParse.replace(regex, params[variable]);
      });

      // return html
      return htmlWithContentParse;
    } catch (error: any) {
      throw new Error(`Failed loading template: ${error.message}`);
    }
  }
}
