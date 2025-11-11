import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ChatHistory.css';
import expandArrowIcon from '../../assets/icons8-expand-arrow-52.png';
import featureIcon from '../../assets/icons8-sidebar_ellipsis-h-30.png';

const ChatHistory = () => {
  // 模拟聊天记录（之后可以替换成后端接口或本地存储）
  const [chats, setChats] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 当前选中的 chatId（从路由解析）
  const selectedId = location.pathname.startsWith('/chat/')
    ? location.pathname.split('/')[2]
    : null;

  // 模拟加载历史聊天（后面可改成 API 请求）
  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem('chatHistory')) || [
      { id: 1, title: '今天的对话' },
      { id: 2, title: '项目讨论' },
      { id: 3, title: 'AI 助手测试' },
    ];
    setChats(storedChats);
  }, []);

  // 点击聊天项
  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

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
            <div
              key={chat.id}
              className={`chat-history__item ${String(chat.id) === selectedId ? 'chat-history__item--selected' : ''}`}
              onClick={() => handleChatClick(chat.id)}
            >
              <span className="chat-history__item-title">{chat.title}</span>
              <img src={featureIcon} alt="功能点" className="chat-history__item-icon" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
