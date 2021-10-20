import { AnyChatComponent, StringChatComponent } from "./types";

export function isStringChatComponent(
  component: AnyChatComponent
): component is StringChatComponent {
  return (component as StringChatComponent).text !== undefined;
}

export type { AnyChatComponent, StringChatComponent };
