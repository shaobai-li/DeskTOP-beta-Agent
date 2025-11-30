import { createContext, useContext, useEffect } from "react";
import { useChatsState } from "@hooks/useChatState";
import { useChatActions } from "@hooks/useChatActions";

export const ChatContext = createContext();

export default function ChatProvider({ children }) {
    const state = useChatsState({
        agents: [],
        chats: [],
        messages: {}
    });

    const actions = useChatActions(state);

    useEffect(() => {
        actions.loadChats();
        actions.loadAgents();
    }, []);

    return (
        <ChatContext.Provider value={{ state, actions }}>
            {children}
        </ChatContext.Provider>
    );
}


export function useChat() {
    return useContext(ChatContext);
}