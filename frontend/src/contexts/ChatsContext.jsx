import { createContext, useEffect, useState, useContext } from "react";
import { getChats } from "@services/chatsService";

export const ChatsContext = createContext();

export default function ChatsProvider({ children }) {

    const [chats, setChats] = useState([]);

    const loadChats = async () => {
        const { data, error } = await getChats();
        if (error) {
            console.error("加载聊天记录失败：", error);
            return;
        }
        setChats(data);
    };

    const addChat = (chat) => {
        setChats(prev => [chat, ...prev]);
    };

    const updateChatTitle = (chatId, newTitle) => {
        setChats(prev =>
            prev.map(chat =>
                chat.chatId === chatId ? { ...chat, title: newTitle } : chat
            )
        );
    };

    useEffect(() => {loadChats();}, []);

    return (
        <ChatsContext.Provider value={{ chats, addChat, updateChatTitle }}>
            {children}
        </ChatsContext.Provider>
    )
}

export function useChats() {
    return useContext(ChatsContext);
}