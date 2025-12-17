import { getChats, updateChat, deleteChat } from "@services/chatsService";
import { getAgents, createAgent, updateAgent, deleteAgent, updateAgentTags } from "@services/agentsService";
import { getMessages } from "@services/messagesService";
import { getTags } from "@services/tagsService";


export function useChatActions(state) {

    const loadChats = async () => {
        const { data, error } = await getChats();
        if (error) {
            console.error("加载聊天记录失败：", error);
            return;
        }
        state.setChats(data);
        
        for (const chat of data) {
            ensureChat(chat.chatId);
        }
    };

    const addChat = (chat) => {
        state.setChats(prev => [chat, ...prev]);
        ensureChat(chat.chatId);
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

    const deleteChatById = async (chatId) => {
        const { error } = await deleteChat(chatId);
        if (error) {
            console.error("删除聊天记录失败：", error);
            return;
        }
        state.setChats(prev => prev.filter(chat => chat.chatId !== chatId));

        state.setMessages(prev => { const p = { ...prev }; delete p[chatId]; return p; });
        state.setIsLoaded(prev => { const p = { ...prev }; delete p[chatId]; return p; });
        state.setIsStreaming(prev => { const p = { ...prev }; delete p[chatId]; return p; });
    };
    
    const ensureChat = (chatId) => {
        state.setMessages(prev => {
            if (prev[chatId]) return prev;
            return { ...prev, [chatId]: [] };
        });
        
        state.setIsLoaded(prev => {
            if (prev[chatId] !== undefined) return prev;
            return { ...prev, [chatId]: false };
        });

        state.setIsStreaming(prev => {
            if (prev[chatId] !== undefined) return prev;
            return { ...prev, [chatId]: false };
        });
    };

    const appendMessage = (chatId, message) => {
        state.setMessages(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), message]
        }));
    };

    const replaceMessages = (chatId, messagesArray) => {
        state.setMessages(prev => ({
            ...prev,
            [chatId]: messagesArray
        }));
    };

    const loadMessages = async (chatId) => {
        ensureChat(chatId);
        
        if (state.isLoaded[chatId] || state.isStreaming[chatId]) return;


        const { data, error } = await getMessages(chatId);
    
        if (error) {
            appendMessage(chatId, {
                role: "assistant",
                content: "⚠️ 无法加载历史消息，请稍后再试。"
            });
            return;
        }
    
        replaceMessages(chatId, data);

        state.setIsLoaded(prev => ({ ...prev, [chatId]: true }));
        // state.setMessages(prev => {
        //     const existing = prev[chatId] || [];
    
        //     // 只加载历史消息（旧消息），避免覆盖 UI 里新消息
        //     return {
        //         ...prev,
        //         [chatId]: [...data, ...existing]
        //     };
        // });
    };
    

    // 添加一条消息


    const loadAgents = async () => {
        const { data, error } = await getAgents();
        if (error) {
            console.error("加载知能体列表失败：", error);
            return;
        }
        state.setAgents(data);
        
        // 初始化 agentTags 状态
        const initialAgentTags = {};
        data.forEach(agent => {
            if (agent.tags && Array.isArray(agent.tags)) {
                const tagIds = agent.tags.map(tag => tag.tagId ?? tag.id).filter(Boolean);
                initialAgentTags[agent.agentId] = tagIds;
            }
        });
        state.setAgentTags(initialAgentTags);
    };

    const addAgent = async (agentTitle, selectedTags = []) => {
        const tagIds = (selectedTags || []).map(t => t.id ?? t.tagId).filter(Boolean);
        const { data, error } = await createAgent({ title: agentTitle.trim(), tagIds });
        if (error) {
            console.error("创建知能体失败：", error);
            return;
        }
        state.setAgents(prev => [...prev, data.agent]);
        
        // 同时更新 agentTags 状态
        state.setAgentTags(prev => ({
            ...prev,
            [data.agent.agentId]: tagIds
        }));
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

    const deleteAgentById = async (agentId) => {
        const { error } = await deleteAgent(agentId);
        if (error) {
            console.error("删除知能体失败：", error);
            return;
        }
        state.setAgents(prev => prev.filter(agent => agent.agentId !== agentId));
    }

    // 更新知能体的标签
    const updateAgentTagsByAgentId = async (agentId, tagIds) => {

        // 同时更新 agents 状态中的 tags 字段以保持兼容性
        console.log(state.agents)
        state.setAgents(prev => 
            prev.map(agent => {
                if (agent.agentId !== agentId) return agent;
                // 若后端返回最新 agent，直接替换；否则根据 tagIds 回填本地 tags
                const idSet = new Set(tagIds);
                const tags = state.tags.filter(t => idSet.has(t.tagId));
                return { ...agent, tags: tags };
            })
        );

        const { data, error } = await updateAgentTags(agentId, tagIds);
        if (error) {
            console.error("更新知能体标签失败：", error);
            return;
        }
        // 更新独立的 agentTags 状态
        state.setAgentTags(prev => ({
            ...prev,
            [agentId]: tagIds
        }));
        

    };

    const getSelectedAgentId = (chatId) => {
        return state.chats.find(chat => chat.chatId === chatId)?.selectedAgent;
    }

    const setSelectedAgentId = (chatId, agentId) => {
        state.setChats(prev => prev.map(chat => chat.chatId === chatId ? { ...chat, selectedAgent: agentId } : chat));
    }
    

    const getAgentById = (agentId) => {
        return state.agents.find(agent => agent.agentId === agentId) ?? null;
    }

    const loadTags = async () => {
        const { data, error } = await getTags();
        if (error) {
            console.error("加载标签失败：", error);
            return;
        }
        state.setTags(data);
    }
    return { 
        loadChats, 
        addChat, 
        updateChatByTitle,
        deleteChatById,

        loadMessages, 
        appendMessage,
        replaceMessages,
        ensureChat,
        
        loadAgents, 
        addAgent, 
        updateAgentByField,
        deleteAgentById,

        loadTags,
        
        getSelectedAgentId, 
        setSelectedAgentId,
        getAgentById,
        updateAgentTagsByAgentId
    };
}