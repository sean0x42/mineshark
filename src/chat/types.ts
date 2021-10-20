export interface ClickEvent {
  action:
    | "open_url"
    | "run_command"
    | "suggest_command"
    | "change_page"
    | "copy_to_clipboard";
  value: unknown;
}

export interface HoverEvent {
  action: "show_text" | "show_item" | "show_entity";
  value: unknown;
}

export interface ChatComponent {
  bold?: boolean;
  italic?: boolean;
  underlined?: boolean;
  strikethrough?: boolean;
  obfuscated?: boolean;
  color?: string;
  insertion?: string;
  clickEvent?: ClickEvent;
  hoverEvent?: HoverEvent;
  extra?: AnyChatComponent[];
}

export interface StringChatComponent extends ChatComponent {
  text: string;
}

export interface TranslationChatComponent extends ChatComponent {
  translate: string;
  with?: AnyChatComponent[];
}

export interface KeybindChatComponent extends ChatComponent {
  keybind: string;
}

export interface ScoreChatComponent extends ChatComponent {
  score: string;
  name?: string;
  objective?: string;
  value?: string;
}

export interface SelectorChatComponent extends ChatComponent {
  selector: string;
}

export type AnyChatComponent =
  | StringChatComponent
  | TranslationChatComponent
  | KeybindChatComponent
  | ScoreChatComponent
  | SelectorChatComponent;

export type Chat = AnyChatComponent;
