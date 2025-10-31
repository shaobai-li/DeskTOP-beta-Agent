import ChatInput from "./ChatInput";
import UserMessage from "./UserMessage";
import AIMessage from "./AIMessage";
import AgentSwitcher from "./AgentSwitcher";
import VerticalTabs from "./VerticalTabs";
import "./ChatPanel.css";
import { useState, useRef, useEffect } from "react";

export default function ChatPanel() {

    const [messages, setMessages] = useState([
        {
          role: "assistant",
          content: "<card><title>自媒体内容推荐</title><subtitle>为您提供最新热门选题为您提供最新热门选题为您提供最新热门选题为您提供最新热门选题</subtitle></card>"
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
                        // 检查消息内容是否包含<card>标签
                        if (message.content.includes("<card>") && message.content.includes("</card>")) {
                            // 提取所有卡片内容
                            const cardContents = [];
                            const cardRegex = /<card>(.*?)<\/card>/g;
                            let match;
                            
                            while ((match = cardRegex.exec(message.content)) !== null) {
                                const cardContent = match[1];
                                // 检查是否包含title和subtitle标签
                                const titleMatch = cardContent.match(/<title>(.*?)<\/title>/);
                                const subtitleMatch = cardContent.match(/<subtitle>(.*?)<\/subtitle>/);
                                
                                if (titleMatch && subtitleMatch) {
                                    // 如果包含title和subtitle标签，则提取它们的内容
                                    cardContents.push({
                                        title: titleMatch[1],
                                        subtitle: subtitleMatch[1]
                                    });
                                } else {
                                    // 否则，使用原始内容
                                    cardContents.push(cardContent);
                                }
                            }
                            
                            // 提取卡片前后的消息内容
                            const parts = message.content.split(/<\/?card>/);
                            const messageBeforeCard = parts[0];
                            
                            // 创建一个包含所有内容的数组，按顺序排列
                            const contentElements = [];
                            
                            // 添加第一个卡片前的内容
                            if (messageBeforeCard && messageBeforeCard.trim() !== "") {
                                contentElements.push(
                                    <AIMessage key={`ai-before-${index}`} message={messageBeforeCard} />
                                );
                            }
                            
                            // 添加卡片和卡片之间的内容
                            for (let i = 0; i < cardContents.length; i++) {
                                // 添加卡片
                                contentElements.push(
                                    <VerticalTabs key={`card-${index}-${i}`} cardContents={[cardContents[i]]} />
                                );
                                
                                // 添加卡片后的内容（如果不是最后一个卡片且有内容）
                                const afterCardIndex = (i + 1) * 2;
                                if (afterCardIndex < parts.length && parts[afterCardIndex] && parts[afterCardIndex].trim() !== "") {
                                    contentElements.push(
                                        <AIMessage key={`ai-between-${index}-${i}`} message={parts[afterCardIndex]} />
                                    );
                                }
                            }
                            
                            return (
                                <div key={index}>
                                    {contentElements}
                                </div>
                            );
                        } else {
                            return <AIMessage key={index} message={message.content} />;
                        }
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