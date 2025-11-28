import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ChatHistory.css';
import expandArrowIcon from '@assets/icon-ui-arrow-expand.png';
import MenuItem from './MenuItem';
import { apiGet } from '@services/apiClient';
import { updateChat } from '@services/chatsService';

const ChatHistory = ({ selectedItem, handleMenuItemClick }) => {
  // 模拟聊天记录（之后可以替换成后端接口或本地存储）
  const [chats, setChats] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  // 当前选中的 chatId（从路由解析）
  const selectedId = location.pathname.startsWith('/chat/')
    ? location.pathname.split('/')[2]
    : null;


  const handleChatRename = (chatId) => async (newTitle) => {
    const { error } = await updateChat(chatId, { title: newTitle });
    if (error) {
      console.error("重命名聊天记录失败：", error);
      return;
    }
    setChats(prev => prev.map(chat => chat.chatId === chatId ? { ...chat, title: newTitle } : chat));
  }

  return (
    <div className="chat-history">
      <div className="chat-history__header" onClick={() => setIsOpen((prev) => !prev)}>
        <h4 className="chat-history__header-title">聊天</h4>
        <span
          className={`chat-history__header-icon ${isOpen ? 'chat-history__header-icon--expanded' : 'chat-history__header-icon--collapsed'}`}
          style={{
            WebkitMaskImage: `url(${expandArrowIcon})`,
            maskImage: `url(${expandArrowIcon})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
            maskSize: 'contain'
          }}
        />
      </div>

      {isOpen && (
        <div className="chat-history__list">
          {chats.map((chat) => (
            <MenuItem
              key={chat.chatId}
              title={chat.title}
              path={`/chat/${chat.chatId}`}
              icon={null} 
              selectedItem={selectedItem}
              handleMenuItemClick={handleMenuItemClick}
              onRename={handleChatRename(chat.chatId)}
              hasFeature={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
