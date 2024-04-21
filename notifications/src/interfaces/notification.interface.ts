import { MessageBrokerInterface } from "./broker.interface";

export interface NotificationSenderInterface {
  sendMessage(message: MessageBrokerInterface): Promise<void>;
}

export interface EmailMessageInterface {
  from: string;    // Sender
  to: string | null;    // Recipient
  subject: string;    // Email subject
  html: string;    // Email HTML content
}
