import { useState, useCallback, useMemo } from "react";
import { RepositoryFactory } from "../repositories";
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

  const chatbotRepository = useMemo(() => RepositoryFactory.getChatbot(), []);

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
      const res = await chatbotRepository.sendMessage(text);
      setMessages((prev) => [...prev, res.data]);
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
  }, [chatbotRepository]);

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
export default useChatbot;
