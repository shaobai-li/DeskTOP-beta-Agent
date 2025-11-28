import { apiGet } from "@services/apiClient";
import { getChats, updateChat } from "@services/chatsService";
import { getAgents, createAgent, updateAgent } from "@services/agentsService";

export function useChatActions(state) {

    const loadChats = async () => {
        const { data, error } = await getChats();
        if (error) {
            console.error("加载聊天记录失败：", error);
            return;
        }
        state.setChats(data);
    };

    const addChat = (chat) => {
        console.log("addChat", chat);
        state.setChats(prev => [chat, ...prev]);
    };

    const updateChatByTitle = async (chatId, newTitle) => {
        state.setChats(prev =>
            prev.map(chat =>
                chat.chatId === chatId ? { ...chat, title: newTitle } : chat
            )
        );

        const { error } = await updateChat(chatId, { title: newTitle });
        if (error) {
            console.error("更新聊天记录标题失败：", error);
            return;
        }
    };

    const loadMessages = async (chatId) => {
            if (!chatId) {
                state.setMessages([
                    { role: "assistant", content: "你好，这是新的聊天窗口，有什么可以帮你？" }
                ]);
                return;
            }

            const { data, error } = await apiGet(`/api/chat/${chatId}/messages`);

            if (error) {
                state.setMessages([
                    { role: "assistant", content: "⚠️ 无法加载历史消息，请稍后再试。" }
                ]);
                return;
            }
            
            if (data?.length > 0) state.setMessages(data);
            else state.setMessages([{ role: "assistant", content: "你好，这是新的聊天窗口，有什么可以帮你？" }]);
    };

    const loadAgents = async () => {
        const { data, error } = await getAgents();
        if (error) {
            console.error("加载知能体列表失败：", error);
            return;
        }
        state.setAgents(data);
    };

    const addAgent = async (agentTitle) => {
        const { data, error } = await createAgent({ title: agentTitle.trim() });
        if (error) {
            console.error("创建知能体失败：", error);
            return;
        }
        state.setAgents(prev => [...prev, data.agent]);
    }

    const updateAgentByField = async (agentId, field, newValue) => {
        state.setAgents(prev => 
            prev.map(agent => 
                agent.agentId === agentId ? { ...agent, [field]: newValue } : agent
            )
        );

        const { error } = await updateAgent(agentId, { [field]: newValue })
        if (error) {
            console.error("更新知能体失败：", error);
            return;
        }

    }

    const getSelectedAgentId = (chatId) => {
        return state.chats.find(chat => chat.chatId === chatId)?.selectedAgent;
    }

    const setSelectedAgentId = (chatId, agentId) => {
        state.setChats(prev => prev.map(chat => chat.chatId === chatId ? { ...chat, selectedAgent: agentId } : chat));
    }
    

    const getAgentById = (agentId) => {
        return state.agents.find(agent => agent.agentId === agentId) ?? null;
    }

    return { 
        loadChats, 
        addChat, 
        updateChatByTitle, 
        loadMessages, 
        loadAgents, 
        addAgent, 
        updateAgentByField,
        getSelectedAgentId, 
        setSelectedAgentId,
        getAgentById
    };
}