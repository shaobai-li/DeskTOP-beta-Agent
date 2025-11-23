import "./TopicCard.css";
import ReactMarkdown from "react-markdown";
import Button from "../common/Button";

function TopicCard({ cardContents = [], isSelected = false, onSelect }) {

  // cardContents 只会有 1 个内容
  const content = cardContents[0] || {};
  const title = `💡 ${content.title || ""}`;
  const description = content.subtitle || "";

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
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default TopicCard;