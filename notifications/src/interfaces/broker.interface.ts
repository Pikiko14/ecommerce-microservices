export enum TypeNotification {
  EMAIL = "email",
  SMS = "sms",
  WHATSAPP = "whatsapp",
}

export interface MessageBrokerInterface {
  data: any;
  type_notification: TypeNotification;
  template: string;
  to: string | null | undefined;
  subject: string | null | undefined;
}
