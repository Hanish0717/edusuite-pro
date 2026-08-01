import { useState, useCallback } from "react";
import { ChatbotApi } from "../services/chatbot.api";
import type { ChatMessage } from "../types";

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am your AI campus assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [typing, setTyping] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `MSG-${Date.now()}-U`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    try {
      const response = await ChatbotApi.sendMessage(text);
      setMessages((prev) => [...prev, response]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `MSG-${Date.now()}-ERR`,
        sender: "bot",
        text: "Sorry, I am having trouble connecting right now. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setTyping(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: "Chat history cleared. How can I assist you?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  return {
    messages,
    typing,
    sendMessage,
    clearChat,
  };
}
