import "./TopicCard.css";
import { useContext } from "react";
import ReactMarkdown from "react-markdown";
import Button from "../common/Button";
import { SendMessageContext } from "@contexts/SendMessageContext";

function TopicCard({ cardContents, isSelected = false, onSelect }) {

  const { handleSendMessage } = useContext(SendMessageContext);
  // cardContents 只会有 1 个内容
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