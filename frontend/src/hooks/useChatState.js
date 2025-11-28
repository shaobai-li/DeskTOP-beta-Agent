import { useState } from "react";

export function useChatsState() {
    
    const [chats, setChats] = useState([]);
    const [agents, setAgents] = useState([]);
    const [messages, setMessages] = useState([]);

    return { chats, setChats, agents, setAgents, messages, setMessages };

}