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
import { getAgents, createAgent } from '@services/agentsService';

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

    useEffect(() => {
      async function loadAgents() {
        const { data, error } = await getAgents();
  
        if (error) {
          console.error("加载知能体失败：", error);
          return;
        }
        
        setAgents(data);
      }
      loadAgents();
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

    const handleCreateAgent = async (agentTitle) => {
      if (!agentTitle.trim()) {
        return;
      }

      
      const { data, error } = await createAgent({ title: agentTitle.trim() });
      

      if (error) {
        console.error("创建知能体失败：", error);
        return;
      }

      console.log("创建知能体成功：", data);
      // 将新创建的知能体添加到列表
      setAgents(prev => [...prev, data.agent]);
      // 关闭模态框并重置表单
    };
    const handleCloseModal = () => {
      setShowNewAgentModal(false);
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
                                     { isOpenAgents && (
            <div className="mt-2 p-0 overflow-y-auto max-h-[300px]">
                {agents.map((agent) => (
                  <MenuItem
                    key={agent.agentId}
                    title={agent.title}
                    path={`/agent/${agent.agentId}`}
                    icon={null} 
                    selectedItem={selectedItem}
                    handleMenuItemClick={handleMenuItemClick}
                    hasFeature={true}
                  />
                ))}
              </div>
          )}
          <MenuGroupHeader title="聊天"
                           isOpen={isOpenChats}
                           onToggle={() => setIsOpenChats(prev => !prev)} />
          { isOpenChats && (
            <div className="mt-2 p-0 overflow-y-auto max-h-[300px]">
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
            <NewAgentModal 
              onClose={handleCloseModal}
              onCreate={handleCreateAgent}
            />
          )
        }
      </>
    )
};