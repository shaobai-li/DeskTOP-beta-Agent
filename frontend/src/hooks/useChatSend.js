import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { beginChat, streamChat } from '@services/messagesService';
import { useChats } from "@contexts/ChatsContext"; // 假设这个路径是对的

// 辅助函数：处理流式数据块
const processStreamChunk = (jsonStr, setMessages) => {
    try {
        const { stage, generated_content } = JSON.parse(jsonStr);
        setMessages((prev) => {
            // 查找是否已经有正在生成的 assistant 消息
            const index = prev.findIndex((msg) => msg.role === "assistant" && msg.stage === stage);
            if (index !== -1) {
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    content: updated[index].content + "\n" + generated_content
                };
                return updated;
            }
            return [...prev, { role: "assistant", stage, content: generated_content }];
        });
    } catch (err) {
        console.error("JSON parse error:", err, jsonStr);
    }
};

export const useChatSend = (chatId, selectedAgentId, setMessages) => {
    const messagesEndRef = useRef(null);
    const { addChat } = useChats();
    const navigate = useNavigate();


    const handleSendMessage = async (message) => {
        // 乐观更新 UI
        setMessages((prev) => [...prev, { role: "user", content: message }]);

        // A.如果是新会话：创建并跳转
        if (!chatId) {
            const { data, error } = await beginChat({
                topic: message,
                agent_id: selectedAgentId,
                chat_id: null
            });

            if (error) {
                console.error("开始聊天失败：", error);
                // 这里建议添加 UI 错误提示逻辑
                return;
            }

            addChat({ chatId: data.chatId, title: data.title });
            navigate(`/chat/${data.chatId}`);
        } 
        // B. 如果是已有会话：流式请求 (整合了你原本的 handleSendMessage_old 逻辑)
        else {
            try {
                const response = await fetch("/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ topic: message, agent_id: selectedAgentId, chat_id: chatId })
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
                        processStreamChunk(jsonStr, setMessages);
                    }
                }
            } catch (error) {
                console.error("Streaming Error:", error);
                setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ 连接中断，请重试。" }]);
            }
        }
    };

    return { handleSendMessage };
};