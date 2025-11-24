import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./NewAgentModal.css";
import lightBulbIcon from "@assets/icon-ui-light-bulb.svg";
import Button from "@components/common/Button";
import Input from "@components/common/Input";

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
        <div className="new-agent-modal-background fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[9999]" onClick={handleWrapperClick}>
            <div className="new-agent-model w-[90vw] max-w-[510px] bg-white rounded-[24px] flex flex-col">
                <div className="new-agent-modal-header flex flex-row items-center justify-between px-4 py-4">

                    <h2 className="text-2xl font-bold">知能体名称</h2>
                    <button className="pm-close-btn" onClick={onClose}>✕</button>

                </div>

                <div className="new-agent-modal-body flex flex-col flex-grow gap-4 px-4 py-4">
                    <Input
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                    />
                    <div className="pm-info-box">
                        <img src={lightBulbIcon} alt="light bulb" className="pm-icon" />
                        <span className="pm-info-text">
                            知能体会将人设与多层级的提示词集中在一个地方，您可以用它们来提升创作效率，或更系统地管理您的设定。
                        </span>
                    </div>

                </div>


                

                <div className="new-agent-model-footer flex flex-row items-center justify-end px-4 py-4">
                    <Button text="创建知能体" onClick={handleCreate} />
                </div>
            </div> 
        </div>
    );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default NewAgentModal;