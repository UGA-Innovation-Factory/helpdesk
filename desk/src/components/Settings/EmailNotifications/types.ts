export type NotificationName =
  | "share_feedback"
  | "acknowledgement"
  | "new_ticket_created"
  | "reply_to_agents"
  | "reply_via_agent";

export type Notification = {
  name: NotificationName;
  label: string;
  description: string;
};

export type AtLeastOneNotifcation = [Notification, ...Notification[]];

export type BaseSettings = {
  enabled: boolean;
  content: string;
};

export type ReplyToAgentsSettings = BaseSettings & {
  allow_reply_to_agent_template_for_email_tickets: boolean;
};

export type ReplyViaAgentSettings = BaseSettings & {
  allow_reply_via_agent_template_for_email_tickets: boolean;
};
