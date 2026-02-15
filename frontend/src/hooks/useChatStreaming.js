import { beginChat, streamChat } from "@services/messagesService";
import { useNavigate } from "react-router-dom";
import { useChat } from "@contexts/ChatContext";



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
                    
                    try {
                        const parsedMessage = JSON.parse(jsonStr);
                        const { event, id, data } = parsedMessage;
                        const { content, index, chunking } = data || {};
                        
                        // 打印后端发送的完整 JSON 消息
                        console.log('后端消息:', parsedMessage);
                        
                        if (event === "status") {
                            // 状态消息
                            state.setStatusMessage(prev => ({ ...prev, [currentChatId]: content }));
                        } else if (event === "message") {
                            // 真正的消息内容
                            state.setStatusMessage(prev => ({ ...prev, [currentChatId]: null }));
                            
                            if (chunking) {
                                // chunking=true，表示需要追加到已有消息
                                state.setMessages(prev => {
                                    const messages = prev[currentChatId] || [];
                                    const updatedMessages = [...messages];
                                    
                                    // 找到相同 message_id 的消息
                                    const targetIndex = updatedMessages.findIndex(
                                        msg => msg.messageId === id
                                    );
                                    
                                    if (targetIndex !== -1) {
                                        // 找到了，追加内容
                                        updatedMessages[targetIndex] = {
                                            ...updatedMessages[targetIndex],
                                            content: updatedMessages[targetIndex].content + '\n' + content
                                        };
                                    } else {
                                        // 第一次出现这个 message_id，创建新消息
                                        updatedMessages.push({
                                            role: "assistant",
                                            content: content,
                                            messageId: id,
                                            index: index
                                        });
                                    }
                                    
                                    return {
                                        ...prev,
                                        [currentChatId]: updatedMessages
                                    };
                                });
                            } else {
                                // chunking=false 或 undefined，创建新消息
                                actions.appendMessage(currentChatId, {
                                    role: "assistant",
                                    content: content,
                                    messageId: id,
                                    index: index
                                });
                            }
                        }
                    } catch (err) {
                        console.error("JSON parse error:", err, jsonStr);
                    }
                    
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