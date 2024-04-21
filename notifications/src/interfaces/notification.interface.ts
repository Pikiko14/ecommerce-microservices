import { MessageBrokerInterface } from "./broker.interface";

export interface NotificationSenderInterface {
  sendMessage(message: MessageBrokerInterface): Promise<void>;
}
