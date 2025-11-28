import ChatInput from "@components/chatbot/ChatInput";
import UserMessage from "@components/chatbot/UserMessage";
import AIMessage from "@components/chatbot/AIMessage";
import "./ChatPage.css";
import { useChat } from "@contexts/ChatContext";
import { useRef, useEffect, useState } from "react";
import { useChatStreaming } from "@hooks/useChatStreaming";
import { useParams } from "react-router-dom";
import { createContext, useContext } from "react";

const ChatPageContext = createContext(null);
export function useChatPageContext() {
    return useContext(ChatPageContext);
}

export default function ChatPage() {

    const { chatId } = useParams();
    const { state, actions } = useChat();
    const { handleSendMessage } = useChatStreaming(state, actions, chatId);

    // const selectedAgentId = actions.getSelectedAgentId(chatId);
    const selectedAgentId = actions.getSelectedAgentId(chatId);

    const setSelectedAgentId = (agentId) => {
        actions.setSelectedAgentId(chatId, agentId);
    }

    const messagesEndRef = useRef(null);

    useEffect(() => {
        actions.loadMessages(chatId);
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [state.messages]);

    return (
        <ChatPageContext.Provider value={{ chatId, selectedAgentId }}>
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
                    <ChatInput onSendMessage={handleSendMessage} setAgentId={setSelectedAgentId} availableAgents={state.agents} />
                    <p className="input-footer-text"> Powered by 知能新体 — 提升你的自媒体内容生产效率</p>
                        
                </div>
            </div>
        </ChatPageContext.Provider>
    );
}