import ChatInput from "./ChatInput";
import UserMessage from "./UserMessage";
import AIMessage from "./AIMessage";
import AgentSwitcher from "./AgentSwitcher";
import "./ChatPanel.css";
import { useState, useRef, useEffect } from "react";

export default function ChatPanel() {

    const [messages, setMessages] = useState([
        {
          role: "assistant",
          content: "<card><title>自媒体内容推荐</title><subtitle>这是自媒体内容推荐的简短描述</subtitle></card><card><title>自媒体内容推荐</title><subtitle>这是自媒体内容推荐的简短描述</subtitle></card>"
        }
    ]);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

      
    const handleSendMessage = async (message) => {
        // 先显示用户输入
        setMessages((prev) => [...prev, { role: "user", content: message }]);
      
        try {
          const response = await fetch("/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ topic: message })
          });
      
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
      
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let partialChunk = "";
      
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
      
            // 解码流式分段
            partialChunk += decoder.decode(value, { stream: true });
            const parts = partialChunk.split("\n");
            partialChunk = parts.pop(); // 保留未完整的部分
      
            for (const jsonStr of parts) {
              if (!jsonStr.trim()) continue;
      
              try {
                const data = JSON.parse(jsonStr);
      
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: data.generated_content}
                ]);
              } catch (e) {
                console.error("JSON parse error:", e, jsonStr);
              }
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
        <div className="chat-panel">
            <AgentSwitcher />
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
                <ChatInput onSendMessage={handleSendMessage} />
                <p className="input-footer-text"> Powered by 知能新体 — 提升你的自媒体内容生产效率</p>
            </div>
        </div>
    )
}