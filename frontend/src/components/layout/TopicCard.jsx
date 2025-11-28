import "./TopicCard.css";
import ReactMarkdown from "react-markdown";
import Button from "../common/Button";
import { useChatStreaming } from "@hooks/useChatStreaming";
import { useChat } from "@contexts/ChatContext";

import { useChatPageContext } from "@pages/ChatPage";


function TopicCard({ cardContents, isSelected = false, onSelect }) {

  const { state, actions } = useChat();

  const { chatId, selectedAgentId } = useChatPageContext();
  const { handleSendMessage } = useChatStreaming(state, actions, {chatId, selectedAgentId});


  const content = cardContents || {};
  const title = `💡 ${content.title || ""}`;
  const description = content.subtitle || "";

  const handleClick = (e) => {
    console.log(cardContents);
    handleSendMessage(JSON.stringify(cardContents));
    e.stopPropagation();
  }

  return (
    <div
      className={`topiccard-container ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <div className="topiccard-option-title">{title}</div>
      <div className="topiccard-option-description">
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>

      {isSelected && (
        <div className="flex justify-end mt-3 w-full">
          <Button
            text="确认"
            onClick={handleClick}
          />
        </div>
      )}
    </div>
  );
}

export default TopicCard;