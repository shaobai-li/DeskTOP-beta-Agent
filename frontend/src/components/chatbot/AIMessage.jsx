import "./AIMessage.css";
import ReactMarkdown from "react-markdown";
import TopicCardList from "@components/layout/TopicCardList";
import CollapsibleText from "@components/layout/CollapsibleText";
import { parseMessage, MESSAGE_PART_TYPES } from "@utils/messageParser";

export default function AIMessage({ message }) {
  // 解析消息，获取所有部分
  const parts = parseMessage(message);

  // 将连续的 TOPIC 部分组合在一起
  const groupedParts = [];
  let currentTopicGroup = [];

  parts.forEach((part, index) => {
    if (part.type === MESSAGE_PART_TYPES.TOPIC) {
      currentTopicGroup.push(part.topicData);
    } else {
      // 如果有累积的 TOPIC，先添加到结果中
      if (currentTopicGroup.length > 0) {
        groupedParts.push({
          type: 'TOPIC_GROUP',
          topics: currentTopicGroup,
        });
        currentTopicGroup = [];
      }
      // 添加当前非 TOPIC 部分
      groupedParts.push(part);
    }
  });

  // 处理最后可能剩余的 TOPIC 组
  if (currentTopicGroup.length > 0) {
    groupedParts.push({
      type: 'TOPIC_GROUP',
      topics: currentTopicGroup,
    });
  }

  return (
    <div className="ai-message">
      {groupedParts.map((part, i) => {
        if (part.type === 'TOPIC_GROUP') {
          return (
            <TopicCardList
              key={`topic-group-${i}`}
              topics={part.topics}
            />
          );
        } else if (part.type === MESSAGE_PART_TYPES.COLLAPSIBLE) {
          return (
            <CollapsibleText
              key={`collapsible-${i}`}
              content={part.content}
            />
          );
        } else {
          return (
            <div key={`text-${i}`} className="ai-message-bubble">
              <ReactMarkdown>{part.content}</ReactMarkdown>
            </div>
          );
        }
      })}
    </div>
  );
}
