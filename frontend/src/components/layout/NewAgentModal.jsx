import React, { useState } from "react";
import ReactDOM from "react-dom";
import lightBulbIcon from "@assets/icon-ui-light-bulb.svg";
import Button from "@components/common/Button";
import Input from "@components/common/Input";
import DarkBackground from "@components/common/DarkBackground";

export default function NewAgentModal({ onClose, onCreate }) {
    const [agentName, setAgentName] = useState("");
    const handleCreate = () => {
        onCreate(agentName);
        onClose();
    };

    const handleChange = (e) => {
        setAgentName(e.target.value);
    }


    const modalContent = (
        <DarkBackground onClose={onClose}>
            <div className="new-agent-model border border-neutral-300 w-[90vw] max-w-[510px] bg-white rounded-[24px] flex flex-col">
                <div className="new-agent-modal-header flex flex-row items-center justify-between px-4 py-4">

                    <h2 className="text-2xl font-bold">知能体名称</h2>
                    <button className="pm-close-btn" onClick={onClose}>✕</button>

                </div>

                <div className="new-agent-modal-body flex flex-col flex-grow gap-4 px-4 py-4">
                    <Input
                      value={agentName}
                      onChange={handleChange}
                    />
                    <div className="flex items-start gap-2 px-4 py-4 text-xs text-neutral-500 bg-neutral-100 rounded-[12px]">
                        <img src={lightBulbIcon} alt="light bulb" className="w-4 h-4" />
                        <span className="text-2xs leading-relaxed">
                            知能体会将人设与多层级的提示词集中在一个地方，您可以用它们来提升创作效率，或更系统地管理您的设定。
                        </span>
                    </div>

                </div>

                <div className="new-agent-model-footer flex flex-row items-center justify-end px-4 py-4">
                    <Button text="创建知能体" onClick={handleCreate} />
                </div>
            </div> 
        </DarkBackground>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};