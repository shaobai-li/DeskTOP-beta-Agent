import ChatInput from "./components/ChatInput";
import UserMessage from "./components/UserMessage";
import AIMessage from "./components/AIMessage";
import { useState } from "react";
//import "./border.css";
import "./App.css";


function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "您好，今天您有什么感兴趣的自媒体内容选题吗？"
    }
  ]);
  
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
  
      // 👇 改这里 — 用流式读取 response.body
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
        { role: "assistant", content: "⚠️ Server connection failed." }
      ]);
    }
  };

  return (
    <div className="app-container">
      <div className="side-panel">
      </div>
      <div className="chat-panel">
        <div className="messages-container">
          {messages.map((message, index) => (
            message.role === "user" ? (<UserMessage key={index} message={message.content} />) : (<AIMessage key={index} message={message.content} />
            )
          ))}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>    
  )
}

export default App
