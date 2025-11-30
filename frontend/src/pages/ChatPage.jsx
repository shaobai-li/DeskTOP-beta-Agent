import ChatInput from "@components/chatbot/ChatInput";
import UserMessage from "@components/chatbot/UserMessage";
import AIMessage from "@components/chatbot/AIMessage";
import Loading from "@components/common/Loading";  // 添加 Loading 导入
import "./ChatPage.css";
import { useChat } from "@contexts/ChatContext";
import { useRef, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { createContext, useContext } from "react";

const ChatPageContext = createContext(null);
export function useChatPageContext() {
    return useContext(ChatPageContext);
}

export default function ChatPage() {

    const { chatId = "new" } = useParams();
    const { state, actions } = useChat();

    const messagesEndRef = useRef(null);

    // 检查聊天是否存在（仅当 chatId 有值时才检查）
    const chatExists = chatId === "new" || state.chats.some(chat => chat.chatId === chatId);

    useEffect(() => {
        if (chatId !== "new") {            
            actions.loadMessages(chatId);        
        } else {
            actions.replaceMessages(chatId, [{ role: "assistant", content: "你好，这是新的聊天窗口，有什么可以帮你？" }]);
        }
    }, [chatId]);

    const currentMessages = state.messages[chatId] ?? [];
    const currentStatusMessage = state.statusMessage?.[chatId];  // 获取当前状态消息

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentMessages]);

    // 如果聊天不存在，跳转到首页（新建聊天页面）
    if (!chatExists) {
        return <Navigate to="/" replace />
    }

    return (    
        <div className="chat-panel">
            <div className="messages-container">
                <div className="messages-list">
                    {currentMessages.map((message, index) => {
                        if (message.role === "user") {
                            return <UserMessage key={index} message={message.content} />;
                        } else {
                            return <AIMessage key={index} message={message.content} />;
                        }
                    })}
                    {/* 临时状态消息：在消息列表末尾单独显示 */}
                    {currentStatusMessage && (
                        <Loading 
                            key={currentStatusMessage}  // 添加 key，文字变化时强制重新创建组件
                            text={currentStatusMessage} 
                            className="mt-4"
                        />
                    )}
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