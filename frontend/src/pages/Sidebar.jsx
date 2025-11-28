import React, { useState } from 'react';
import './Sidebar.css';
import MenuItem from '../components/sidebar/MenuItem';
import MenuGroupHeader from '@components/common/MenuGroupHeader';
import NewAgentModal from '@components/layout/NewAgentModal';
import databaseIcon from '@assets/icon-nav-database.png';
import newChatIcon from '@assets/icon-nav-new-chat.png';
import newAgentIcon from '@assets/icon-nav-new-agent.svg';
import logo from '@assets/icon-brand-logo.png';
import { useChat } from '@contexts/ChatContext';

export default function SidePanel() {

    const [selectedItem, setSelectedItem] = useState(null);

    const [isOpenAgents, setIsOpenAgents] = useState(true);
    const [showNewAgentModal, setShowNewAgentModal] = useState(false);
    
    const [isOpenChats, setIsOpenChats] = useState(true);

    const { state, actions } = useChat();

    const renameChat = (chatId) => async (newTitle) => {
        actions.updateChatByTitle(chatId, newTitle);
    };

    const renameAgent = (agentId) => async (newTitle) => {
        actions.updateAgentByField(agentId, "title", newTitle);
    };

    const newAgent = async (agentTitle) => {
        if (!agentTitle.trim()) {
            return;
        }
        actions.addAgent(agentTitle.trim());
    };

    const handleMenuItemClick = (itemName) => {
        setSelectedItem(itemName);
    };

    const handleNewAgentClick = () => {
        setShowNewAgentModal(true);
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
                    itemId={"item-new-chat"}
                    path="/"
                    selectedItem={selectedItem}
                    renderOnSelected={false}
                    handleMenuItemClick={handleMenuItemClick}
                    icon={newChatIcon} />
          <MenuItem title="我的知识库" 
                    itemId={"item-textbase"}
                    path="/textbase"
                    selectedItem={selectedItem} 
                    handleMenuItemClick={handleMenuItemClick}
                    icon={databaseIcon} />
          <MenuItem title="新建知能体" 
                    itemId={"item-new-agent"}
                    path="#"
                    selectedItem={selectedItem}
                    renderOnSelected={false}
                    handleMenuItemClick={handleNewAgentClick}
                    icon={newAgentIcon} />
          <MenuGroupHeader title="知能体库"
                           isOpen={isOpenAgents}
                           onToggle={() => setIsOpenAgents(prev => !prev)} />
          { isOpenAgents && (
            <div className="mt-2 p-0 overflow-y-auto max-h-[300px]">
                {state.agents.map((agent) => (
                  <MenuItem
                    key={agent.agentId}
                    title={agent.title}
                    itemId={agent.agentId}
                    path={`/agent/${agent.agentId}`}
                    icon={null} 
                    selectedItem={selectedItem}
                    handleMenuItemClick={handleMenuItemClick}
                    onRename={renameAgent(agent.agentId)}
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
                {state.chats.map((chat) => (
                  <MenuItem
                    key={chat.chatId}
                    title={chat.title}
                    itemId={chat.chatId}
                    path={`/chat/${chat.chatId}`}
                    icon={null} 
                    selectedItem={selectedItem}
                    handleMenuItemClick={handleMenuItemClick}
                    onRename={renameChat(chat.chatId)}
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
              onCreate={newAgent}
            />
      )}
    </>
  );
}