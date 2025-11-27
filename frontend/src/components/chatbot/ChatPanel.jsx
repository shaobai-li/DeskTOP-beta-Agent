import { SendMessageContext } from "@contexts/SendMessageContext";
import ChatInput from "./ChatInput";
import UserMessage from "./UserMessage";
import AIMessage from "./AIMessage";
import AgentSwitcher from "./AgentSwitcher";
import "./ChatPanel.css";
import { useState, useRef, useEffect } from "react";
import { apiGet } from '../../services/apiClient';
import { getAgentsMenu } from '@services/agentsService';

function processStreamChunk(jsonStr, setMessages) {
    try {
        const { stage, generated_content } = JSON.parse(jsonStr);

        setMessages((prev) => {
            const index = prev.findIndex(
                (msg) => msg.role === "assistant" && msg.stage === stage
            );

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
}



export default function ChatPanel({ chatId }) {
    const [messages, setMessages] = useState([]);
    const [availableAgents, setAvailableAgents] = useState([]);
    const [selectedAgentId, setSelectedAgentId] = useState(null);


    const messagesEndRef = useRef(null);
    useEffect(() => {
        async function loadMessages() {
            
            if (chatId === null) {
                setMessages([
                    { role: "assistant", content: "你好，这是新的聊天窗口，有什么可以帮你？" }
                ]);
                return;
            }

            const { data, error } = await apiGet(`/api/chat/${chatId}/messages`);

            if (error) {
                console.error("加载聊天记录失败：", error);
                setMessages([
                    { role: "assistant", content: "⚠️ 无法加载历史消息，请稍后再试。" }
                ]);
                return;
            }

            
            if (Array.isArray(data) && data.length > 0) {
            setMessages(data);
            } else {
                setMessages([
                    { role: "assistant", content: "你好，这是新的聊天窗口，有什么可以帮你？" }
                ]);
            }
        }
        
        loadMessages();
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        async function loadAvailableAgents() {
            const { data, error } = await getAgentsMenu();
            if (error) {
                console.error("加载知能体失败：", error);
                return;
            }
            setAvailableAgents(data);
        }
        loadAvailableAgents();
    }, []);

    const handleSendMessage = async (message) => {
        // 先显示用户输入
        setMessages((prev) => [...prev, { role: "user", content: message }]);
        console.log({ topic: message, agent_id: selectedAgentId, chat_id: chatId })
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
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "⚠️ 无法连接到服务器，请稍后重试。" }
            ]);
        }
    };

    return (
        <SendMessageContext.Provider value={{ handleSendMessage }}>
            <div className="chat-panel">
                <div className="messages-container">
                    <div className="messages-list">
                        {messages.map((message, index) => {
                            if (message.role === "user") {
                                return <UserMessage key={index} message={message.content} />;
                            } else {
                                return <AIMessage key={index} message={message.content} />;
                            }
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className="input-container">
                    <ChatInput onSendMessage={handleSendMessage} agentId={selectedAgentId} setAgentId={setSelectedAgentId} availableAgents={availableAgents} />
                    <p className="input-footer-text"> Powered by 知能新体 — 提升你的自媒体内容生产效率</p>
                </div>
            </div>
        </SendMessageContext.Provider>
    )
}