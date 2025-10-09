import ChatInput from "./components/ChatInput";
import UserMessage from "./components/UserMessage";
import AIMessage from "./components/AIMessage";
import { useState } from "react";
//import "./border.css";



function App() {
  const [messages, setMessages] = useState([
    {
      role: "user",
      content: "Hello, how are you?"
    },
    {
      role: "user", 
      content: "fatal: The current branch main has no upstream branch.\nTo push the current branch and set the remote as upstream, use\n\n    git push --set-upstream origin main\n\nTo have this happen automatically for branches without a tracking\nupstream, see 'push.autoSetupRemote' in 'git help config'.\n\n什么意思怎么办"
    },
    {
      role: "assistant",
      content: "This is an AI reply."
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
    <>
      <div className="chat-container"
      style={{display: "flex", flexDirection: "column", maxWidth: "840px"}}>
        {messages.map((message, index) => (
          message.role === "user" ? (<UserMessage key={index} message={message.content} />) : (<AIMessage key={index} message={message.content} />
          )
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </>
  )
}

export default App
