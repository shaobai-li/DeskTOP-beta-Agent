import "./AIMessage.css";
import ReactMarkdown from "react-markdown";
import TopicCard from "../layout/TopicCard";
import { useState } from "react";

// 解析单个 <topic>
const parseTopic = (topicHTML) => {
  const doc = new DOMParser().parseFromString(topicHTML, "text/html");
  const topic = doc.querySelector("topic");
  if (!topic) return null;

  return {
    title: topic.querySelector("title")?.textContent.trim() || "",
    subtitle: topic.querySelector("subtitle")?.textContent.trim() || "",
  };
};

export default function AIMessage({ message }) {
  const topicRegex = /<topic[^>]*>([\s\S]*?)<\/topic>/gi;
  const parts = [];
  let lastIndex = 0;

  // 当前选中的 TopicCard（初始 = null）
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);

  const matches = [...message.matchAll(topicRegex)];

  matches.forEach((match) => {
    const start = match.index;
    const end = start + match[0].length;

    // topic 前面的文本
    const before = message.slice(lastIndex, start).trim();
    if (before) {
      parts.push({ type: "text", content: before });
    }

    // push 一个 topic block
    const topicData = parseTopic(match[0]);
    if (topicData) {
      parts.push({
        type: "topic",
        topicData,
      });
    }

    lastIndex = end;
  });

  // 剩余文本部分
  const tail = message.slice(lastIndex).trim();
  if (tail) {
    parts.push({ type: "text", content: tail });
  }

  return (
    <div
      className="ai-message"
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      {parts.map((p, i) =>
        p.type === "topic" ? (
          <TopicCard
            key={`topic-${i}`}
            cardContents={p.topicData}
            isSelected={selectedTopicIndex === i}
            onSelect={() =>
              setSelectedTopicIndex((prev) => (prev === i ? null : i))
            }
          />
        ) : (
          <div key={`text-${i}`} className="ai-message-bubble">
            <ReactMarkdown>{p.content}</ReactMarkdown>
          </div>
        )
      )}
    </div>
  );
}
