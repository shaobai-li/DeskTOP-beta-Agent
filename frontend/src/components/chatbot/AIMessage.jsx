import "./AIMessage.css";
import ReactMarkdown from "react-markdown";
import TopicCard from "@components/layout/TopicCard";
import CollapsibleText from "@components/layout/CollapsibleText";
import { useState } from "react";
import { parseMessage, MESSAGE_PART_TYPES } from "@utils/messageParser";

export default function AIMessage({ message }) {
  // 当前选中的 TopicCard（初始 = null）
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);

  // 解析消息，获取所有部分
  const parts = parseMessage(message);

  return (
    <div
      className="ai-message"
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      {parts.map((p, i) => {
        if (p.type === MESSAGE_PART_TYPES.TOPIC) {
          return (
            <TopicCard
              key={`topic-${i}`}
              cardContents={p.topicData}
              isSelected={selectedTopicIndex === i}
              onSelect={() =>
                setSelectedTopicIndex((prev) => (prev === i ? null : i))
              }
            />
          );
        } else if (p.type === MESSAGE_PART_TYPES.COLLAPSIBLE) {
          return (
            <CollapsibleText
              key={`collapsible-${i}`}
              content={p.content}
            />
          );
        } else {
          return (
            <div key={`text-${i}`} className="ai-message-bubble">
              <ReactMarkdown>{p.content}</ReactMarkdown>
            </div>
          );
        }
      })}
    </div>
  );
}
