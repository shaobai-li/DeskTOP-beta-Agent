import React, { useState } from 'react';
import MenuItem from '../components/sidebar/MenuItem';
import MenuGroupHeader from '@components/common/MenuGroupHeader';
import NewAgentModal from '@components/layout/NewAgentModal';
import databaseIcon from '@assets/icon-nav-database.png';
import newChatIcon from '@assets/icon-nav-new-chat.png';
import newAgentIcon from '@assets/icon-nav-new-agent.svg';
import logo from '../../public/app_znxt_word_logo_3.png';
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

    const deleteAgentHandler = (agentId) => async () => {
        if (window.confirm('确定要删除这个智能体吗？')) {
            await actions.deleteAgentById(agentId);
        }
    };

    const deleteChatHandler = (chatId) => async () => {
        if (window.confirm('确定要删除这条聊天记录吗？')) {
            await actions.deleteChatById(chatId);
        }
    };

    const newAgent = async (agentTitle, selectedTags = []) => {
        if (!agentTitle.trim()) {
            return;
        }
        actions.addAgent(agentTitle.trim(), selectedTags);
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
        <aside className="w-60 bg-gray-50 h-screen border border-gray-200 overflow-y-auto flex flex-col relative pb-10">
        <div className="sticky top-0 bg-gray-50 z-10 flex-shrink-0">
          <div className="flex justify-left items-center px-6 py-4">
            <img src={logo} alt="logo" className="flex h-12" />
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
            </div>

            <div className="side-panel__scroll-content">
          <MenuGroupHeader title="知能体库"
                           isOpen={isOpenAgents}
                           onToggle={() => setIsOpenAgents(prev => !prev)} />
          { isOpenAgents && (
            <div className="mt-2">
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
                    onDelete={deleteAgentHandler(agent.agentId)}
                    hasFeature={true}
                  />
                ))}
              </div>
          )}
          <MenuGroupHeader title="聊天"
                           isOpen={isOpenChats}
                           onToggle={() => setIsOpenChats(prev => !prev)} />
          { isOpenChats && (
            <div className="mt-2">
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
                    onDelete={deleteChatHandler(chat.chatId)}
                    hasFeature={true}
                  />
                ))}
              </div>
          )}
          </div>
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