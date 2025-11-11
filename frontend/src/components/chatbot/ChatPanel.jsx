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
          content: `您好，请问您有什么感兴趣的自媒体选题么？
          <topic_list><topic><title>【选题4】标题：跨模态AI技术如何塑造未来数字产品</title>
<subtitle>
- 灵感来源：<text 1>, <text 2>
- 核心观点：跨模态能力的AI正在重塑产品界面和用户体验，带来更多创新机会。
- 内容方向：探讨跨模态技术在实际应用中的具体案例，如AI生成的播客、视频，以及未来可能的演变路径。
- 受众价值：启发数字产品开发者探索新技术应用，拓宽产品创新方向。
</subtitle></topic>
</topic_list>`
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