export interface MessageSender {
  sendMessage(message: string): Promise<void>;
}
