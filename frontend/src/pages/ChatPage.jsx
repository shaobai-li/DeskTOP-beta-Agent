import { SendMessageContext } from "@contexts/SendMessageContext";
import ChatInput from "@components/chatbot/ChatInput";
import UserMessage from "@components/chatbot/UserMessage";
import AIMessage from "@components/chatbot/AIMessage";
import "./ChatPage.css";
import { useChatSend } from "@hooks/useChatSend";
import { useChatMessages } from "@hooks/useChatMessages";
import { useChatAgents } from "@hooks/useChatAgents";

export default function ChatPanel({ chatId }) {

    const { availableAgents, selectedAgentId, setSelectedAgentId } = useChatAgents();
    const { messages, setMessages, messagesEndRef } = useChatMessages(chatId);
    const { handleSendMessage } = useChatSend(chatId, selectedAgentId, setMessages);

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