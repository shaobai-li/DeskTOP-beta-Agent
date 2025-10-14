import React, { useState } from 'react';
import './SidePanel.css';
import MenuItem from './MenuItem';

const SidePanel = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleMenuItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  return (
    <aside className="side-panel">
      <MenuItem title="我的数据库" 
                selectedItem={selectedItem} 
                handleMenuItemClick={handleMenuItemClick} />
      <MenuItem title="聊天记录1" 
                selectedItem={selectedItem} 
                handleMenuItemClick={handleMenuItemClick} />
    </aside>
  );
};

export default SidePanel;