import { beginChat, streamChat } from "@services/messagesService";
import { useNavigate } from "react-router-dom";

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

export const useChatStreaming = (state, actions, {chatId = null, selectedAgentId = null}) => {
    const navigate = useNavigate();

    const handleSendMessage = async (message) => {
        // 乐观更新 UI
        state.setMessages((prev) => [...prev, { role: "user", content: message }]);

        let currentChatId = chatId;

        if (!currentChatId) {
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
            actions.addChat(data);
            navigate(`/chat/${currentChatId}`);
        } 

        try {
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
                    processStreamChunk(jsonStr, state.setMessages);
                }
            }
        } catch (error) {
            console.error("Streaming Error:", error);
            state.setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ 连接中断，请重试。" }]);
        }
    };

    return { handleSendMessage };
};