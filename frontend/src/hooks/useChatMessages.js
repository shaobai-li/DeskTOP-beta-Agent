import { useState, useEffect, useRef } from "react";
import { apiGet } from "@services/apiClient";

export function useChatMessages(chatId) {
    const [messages, setMessages] = useState([]);


    return { messages, setMessages, messagesEndRef };
}
