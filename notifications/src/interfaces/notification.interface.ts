import { MessageBrokerInterface } from "./broker.interface";

export interface MessageSender {
  sendMessage(message: MessageBrokerInterface): Promise<void>;
}
