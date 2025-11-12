import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ChatHistory.css';
import expandArrowIcon from '../../assets/icons8-expand-arrow-52.png';
import { mockChatList } from '../../temp/chatData';
import MenuItem from './MenuItem';

const ChatHistory = ({ selectedItem, handleMenuItemClick }) => {
  // 模拟聊天记录（之后可以替换成后端接口或本地存储）
  const [chats, setChats] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  // 当前选中的 chatId（从路由解析）
  const selectedId = location.pathname.startsWith('/chat/')
    ? location.pathname.split('/')[2]
    : null;

  // useEffect(() => {
  //   setChats(mockChatList);
  // }, []);

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch("/api/chats");
        if (!response.ok) throw new Error("网络错误：" + response.status);
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("加载聊天记录失败：", error);
      }
    }
    fetchChats();
  }, []);


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
              hasFeature={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
