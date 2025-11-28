import ChatInput from "@components/chatbot/ChatInput";
import UserMessage from "@components/chatbot/UserMessage";
import AIMessage from "@components/chatbot/AIMessage";
import "./ChatPage.css";
import { useChat } from "@contexts/ChatContext";
import { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createContext, useContext } from "react";

const ChatPageContext = createContext(null);
export function useChatPageContext() {
    return useContext(ChatPageContext);
}

export default function ChatPage() {

    const { chatId } = useParams();
    const { state, actions } = useChat();

    const messagesEndRef = useRef(null);

    useEffect(() => {
        actions.loadMessages(chatId);
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [state.messages]);

    return (    
        <div className="chat-panel">
            <div className="messages-container">
                <div className="messages-list">
                    {state.messages.map((message, index) => {
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
                <ChatInput />
                <p className="input-footer-text"> Powered by 知能新体 — 提升你的自媒体内容生产效率</p>
                    
            </div>
        </div>
    );
}