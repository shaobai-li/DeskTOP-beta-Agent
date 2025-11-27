import { useState, useEffect, useRef } from "react";
import { apiGet } from "@services/apiClient";

export function useChatMessages(chatId) {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        async function loadMessages() {
            if (!chatId) {
                setMessages([
                    { role: "assistant", content: "你好，这是新的聊天窗口，有什么可以帮你？" }
                ]);
                return;
            }

            const { data, error } = await apiGet(`/api/chat/${chatId}/messages`);

            if (error) {
                setMessages([
                    { role: "assistant", content: "⚠️ 无法加载历史消息，请稍后再试。" }
                ]);
                return;
            }
            
            if (data?.length > 0) setMessages(data);
            else setMessages([{ role: "assistant", content: "你好，这是新的聊天窗口，有什么可以帮你？" }]);
        }

        loadMessages();
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return { messages, setMessages, messagesEndRef };
}
