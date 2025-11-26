import React, { useState, useEffect } from 'react';
import './SidePanel.css';
import MenuItem from './MenuItem';
import MenuGroupHeader from '@components/common/MenuGroupHeader';
import NewAgentModal from '@components/layout/NewAgentModal';
import databaseIcon from '@assets/icon-nav-database.png';
import newChatIcon from '@assets/icon-nav-new-chat.png';
import newAgentIcon from '@assets/icon-nav-new-agent.svg';
import logo from '@assets/icon-brand-logo.png';
import { getChats, updateChat } from '@services/chatsService';

export default function SidePanel() {
    const [selectedItem, setSelectedItem] = useState(null);

    const [isOpenAgents, setIsOpenAgents] = useState(true);
    const [isOpenChats, setIsOpenChats] = useState(true);
    const [agents, setAgents] = useState([]);
    const [chats, setChats] = useState([]);

    const [showNewAgentModal, setShowNewAgentModal] = useState(false);

    useEffect(() => {
      async function loadChats() {
        const { data, error } = await getChats();
  
        if (error) {
          console.error("加载聊天记录失败：", error);
          return;
        }
        
        setChats(data);
      }
      loadChats();
    }, []);
  
    const handleChatRename = (chatId) => async (newTitle) => {
      const { error } = await updateChat(chatId, { title: newTitle });
      if (error) {
        console.error("重命名聊天记录失败：", error);
        return;
      }
      setChats(prev => prev.map(chat => chat.chatId === chatId ? { ...chat, title: newTitle } : chat));
    }

    const handleMenuItemClick = (itemName) => {
        setSelectedItem(itemName);
    };

    const handleNewAgentClick = () => {
        setShowNewAgentModal(true);
    };

    return (
      <>
        <aside className="side-panel">
                  <div className="side-panel__logo-container">
            <img src={logo} alt="logo" className="side-panel__sidebar-logo" />
          </div>
          <MenuItem title="新建聊天" 
                    path="/"
                    selectedItem={selectedItem} 
                    handleMenuItemClick={handleMenuItemClick}
                    icon={newChatIcon} />
          <MenuItem title="我的知识库" 
                    path="/textbase"
                    selectedItem={selectedItem} 
                    handleMenuItemClick={handleMenuItemClick}
                    icon={databaseIcon} />
          <MenuItem title="新建知能体" 
                    path="#"
                    selectedItem={selectedItem} 
                    handleMenuItemClick={handleNewAgentClick}
                    icon={newAgentIcon} />
          <MenuGroupHeader title="知能体库"
                           isOpen={isOpenAgents}
                           onToggle={() => setIsOpenAgents(prev => !prev)} />
          <MenuGroupHeader title="聊天"
                           isOpen={isOpenChats}
                           onToggle={() => setIsOpenChats(prev => !prev)} />
          { isOpenChats && (
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

        </aside>
        {
          showNewAgentModal && (
            <NewAgentModal onClose={() => setShowNewAgentModal(false)} />
          )
        }
      </>
    )
};