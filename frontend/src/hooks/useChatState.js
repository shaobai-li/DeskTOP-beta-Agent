import { useState } from "react";

export function useChatsState() {
    
    const [chats, setChats] = useState([]);
    const [agents, setAgents] = useState([]);
    const [tags, setTags] = useState([]);
    const [agentTags, setAgentTags] = useState({}); // agentId → tagId[]
    
    const [messages, setMessages] = useState({}); // chatId → message[]
    const [isLoaded, setIsLoaded] = useState({}); // chatId → boolean
    const [isStreaming, setIsStreaming] = useState({}); // chatId → boolean
    const [statusMessage, setStatusMessage] = useState({}); // chatId → string | null (临时状态提示)

    return {
        chats,
        setChats,
        agents,
        setAgents,
        tags,
        setTags,
        agentTags,
        setAgentTags,
        messages,
        setMessages,
        isLoaded,
        setIsLoaded,
        isStreaming,
        setIsStreaming,
        statusMessage,
        setStatusMessage
    };
}
