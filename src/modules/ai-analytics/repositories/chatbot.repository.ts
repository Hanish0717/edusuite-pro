import { api } from "../services/api";
import type { ChatMessage } from "../types";

export interface IChatbotRepository {
  sendMessage(text: string): Promise<ChatMessage>;
}

export class MockChatbotRepository implements IChatbotRepository {
  sendMessage(text: string): Promise<ChatMessage> {
    return api.post<ChatMessage>("/chatbot/message", { text });
  }
}

const ACTIVE_IMPL = "mock";

export const chatbotRepository: IChatbotRepository =
  ACTIVE_IMPL === "mock" ? new MockChatbotRepository() : new MockChatbotRepository();

export default chatbotRepository;
