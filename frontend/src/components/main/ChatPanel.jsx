import ChatInput from "./ChatInput";
import UserMessage from "./UserMessage";
import AIMessage from "./AIMessage";
import "./ChatPanel.css";

export default function ChatPanel({ messages, handleSendMessage }) {
  return (
    <main className="chat-panel">
        <div className="messages-container">
          <div className="messages-list">
            {messages.map((message, index) => (
              message.role === "user" ? (<UserMessage key={index} message={message.content} />) : (<AIMessage key={index} message={message.content} />
              )
            ))}
          </div>
        </div>
        <div className="input-container">
          <ChatInput onSendMessage={handleSendMessage} />
          <p className="input-footer-text"> Powered by 知能新体 — 提升你的自媒体内容生产效率</p>
        </div>
    </main>
  )
}