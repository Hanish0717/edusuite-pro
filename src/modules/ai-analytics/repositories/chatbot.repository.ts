import type { ChatMessage } from "../types";
import type { ApiResponse } from "@/shared/types/api.types";
import { ChatbotApi } from "../services/api/chatbot.api";

export interface IChatbotRepository {
  sendMessage(text: string): Promise<ApiResponse<ChatMessage>>;
}

export class MockChatbotRepository implements IChatbotRepository {
  async sendMessage(text: string): Promise<ApiResponse<ChatMessage>> {
    try {
      const response = await ChatbotApi.sendMessage(text);
      return { success: true, data: response };
    } catch (err: any) {
      return {
        success: false,
        data: {
          id: `MSG-${Date.now()}-ERR`,
          sender: "bot",
          text: err.message || "Failed to process chatbot request",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        error: err.message,
      };
    }
  }
}

export class SupabaseChatbotRepository implements IChatbotRepository {
  async sendMessage(text: string): Promise<ApiResponse<ChatMessage>> {
    return {
      success: true,
      data: {
        id: `MSG-${Date.now()}-SB`,
        sender: "bot",
        text: "Supabase implementation stub.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    };
  }
}
