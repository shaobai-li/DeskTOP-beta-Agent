import { beginChat, streamChat } from "@services/messagesService";
import { useNavigate } from "react-router-dom";
import { useChat } from "@contexts/ChatContext";


const processStreamChunk = (jsonStr, currentChatId, addMessage, setStatusMessage) => {
    try {
        const { stage, generated_content, is_status_message, topic } = JSON.parse(jsonStr);
        
        console.log("收到消息:", { is_status_message, generated_content });  // 添加日志
        
        if (is_status_message) {
            // 状态消息：更新临时状态，不添加到消息列表
            setStatusMessage(prev => ({ ...prev, [currentChatId]: generated_content }));
        } else {
            // 真正内容：清除状态消息，添加到消息列表
            setStatusMessage(prev => ({ ...prev, [currentChatId]: null }));
            const newAssistantMessage = { 
                role: "assistant", 
                content: generated_content
            }
            addMessage(currentChatId, newAssistantMessage);
        }
        
        // setMessages((prev) => {
        //     // 查找是否已经有正在生成的 assistant 消息
        //     const index = prev.findIndex((msg) => msg.role === "assistant" && msg.stage === stage);
        //     if (index !== -1) {
        //         const updated = [...prev];
        //         updated[index] = {
        //             ...updated[index],
        //             content: updated[index].content + "\n" + generated_content   
        //         };
        //         return updated;
        //     }
        //     return [...prev, { role: "assistant", stage, content: generated_content }];
        // });
    } catch (err) {
        console.error("JSON parse error:", err, jsonStr);
    }
};

export const useChatStreaming = (chatId = null, selectedAgentId = null) => {
    const navigate = useNavigate();

    const { state, actions } = useChat();


    const handleSendMessage = async (message) => {

        const newUserMessage = { role: "user", content: message };
        let currentChatId = chatId;

        if (currentChatId === "new") {
            const { data, error } = await beginChat({
                topic: message,
                chat_id: currentChatId,
                selected_agent: selectedAgentId,
            });

            if (error) {
                console.error("开始聊天失败：", error);
                // 这里建议添加 UI 错误提示逻辑
                return;
            }

            currentChatId = data.chatId
            //actions.setSelectedAgentId(currentChatId, selectedAgentId);
            actions.addChat(data);
            navigate(`/chat/${currentChatId}`);
        } 


        try {
            
            actions.appendMessage(currentChatId, newUserMessage)
            state.setIsStreaming(prev => ({ ...prev, [currentChatId]: true })); 
            const response = await streamChat({
                topic: message,
                chat_id: currentChatId,
                selected_agent: selectedAgentId,
            });

            if (!response.ok) throw new Error("Failed to fetch data");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let partialChunk = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                partialChunk += decoder.decode(value, { stream: true });
                const parts = partialChunk.split("\n");
                partialChunk = parts.pop();

                for (const jsonStr of parts) {
                    if (!jsonStr.trim()) continue;
                    processStreamChunk(jsonStr, currentChatId, actions.appendMessage, state.setStatusMessage);
                    // 让出事件循环，给 React 渲染机会
                    await new Promise(resolve => requestAnimationFrame(resolve));
                }
            }

            // 流结束时清除状态消息
            state.setStatusMessage(prev => ({ ...prev, [currentChatId]: null }));
            state.setIsStreaming(prev => ({ ...prev, [currentChatId]: false }));

        } catch (error) {
            console.error("Streaming Error:", error);
            state.setStatusMessage(prev => ({ ...prev, [currentChatId]: null })); // 出错也清除状态
            actions.appendMessage(currentChatId, [{ role: "assistant", content: "⚠️ 连接中断，请重试。" }]);
        }
    };

    return { handleSendMessage };
};