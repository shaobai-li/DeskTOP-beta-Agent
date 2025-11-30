import { useState } from "react";

export function useChatsState() {
    
    const [chats, setChats] = useState([]);
    const [agents, setAgents] = useState([]);

    const [messages, setMessagesState] = useState({});


    const setMessages = (chatId, updater) => {
        setMessagesState((prev) => {
            const newMessages = updater(prev[chatId] || []);
            return {
                ...prev,
                [chatId]: newMessages
            };
        });
    };

    return {
        chats,
        setChats,
        agents,
        setAgents,
        messages,
        setMessages 
    };
}
