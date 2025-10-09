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
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    console.log(messages);

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

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.generated_content }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Server connection failed" }])
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
