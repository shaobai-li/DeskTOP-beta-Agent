import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./NewAgentModal.css";
import lightBulbIcon from "../../assets/light-bulb.svg";
import Button from "../common/Button";
import Input from "../common/Input";

const NewAgentModal = ({ onClose }) => {
  const [agentName, setAgentName] = useState("");

  const handleCreate = () => {
    // TODO: 待实现创建知能体功能
    // console.log("创建知能体:", agentName);
    // onClose();
  };

  const handleWrapperClick = (e) => {
    // 点击外部区域关闭模态框
    if (e.target.className === "pm-wrapper") {
      onClose();
    }
  };

  const modalContent = (
    <div className="pm-wrapper" onClick={handleWrapperClick}>
      <div className="pm-modal">
        <div className="pm-header">
          <h2 className="pm-title">知能体名称</h2>
          <button className="pm-close-btn" onClick={onClose}>✕</button>
        </div>

        <Input 
          placeholder="" 
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
        />

        <div className="pm-info-box">
          <img src={lightBulbIcon} alt="light bulb" className="pm-icon" />
          <span className="pm-info-text">
            知能体会将人设与多层级的提示词集中在一个地方，您可以用它们来提升创作效率，或更系统地管理您的设定。
          </span>
        </div>

        <div className="pm-button-wrapper">
          <Button text="创建知能体" onClick={handleCreate} />
        </div>  
      </div>
    </div>
  );

  // 使用 Portal 将模态框渲染到 body，确保它在最顶层
  return ReactDOM.createPortal(modalContent, document.body);
};

export default NewAgentModal;
