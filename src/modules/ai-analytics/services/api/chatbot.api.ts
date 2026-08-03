import { api } from "../api";
import type { ChatMessage } from "../../types";

export class ChatbotApi {
  static sendMessage(text: string): Promise<ChatMessage> {
    return api.post<ChatMessage>("/chatbot/message", { text });
  }
}
export default ChatbotApi;
