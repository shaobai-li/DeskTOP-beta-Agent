import "./AIMessage.css";
import ReactMarkdown from "react-markdown";
import VerticalTabs from "./VerticalTabs";

// 简化版：假定 <topic><title><subtitle> 均存在
const parseTopicList = (raw) => {
  const doc = new DOMParser().parseFromString(raw, "text/html");
  const topics = Array.from(doc.querySelectorAll("topic"));

  return topics.map((t) => ({
    title: t.querySelector("title").textContent.trim(),
    subtitle: t.querySelector("subtitle").textContent.trim(),
  }));
};

// 主组件
export default function AIMessage({ message }) {
  const topicListRegex = /<topic_list[^>]*>([\s\S]*?)<\/topic_list>/gi;
  const parts = [];
  let lastIndex = 0;

  // 按 <topic_list> 分割消息
  for (const match of message.matchAll(topicListRegex)) {
    const start = match.index;
    const end = start + match[0].length;

    // 追加 topic_list 前的文本
    const before = message.slice(lastIndex, start).trim();
    if (before) parts.push({ type: "text", content: before });

    // 解析 topic_list 内容
    parts.push({
      type: "topic_list",
      cardContents: parseTopicList(match[1]),
    });

    lastIndex = end;
  }

  // 追加剩余文本
  const tail = message.slice(lastIndex).trim();
  if (tail) parts.push({ type: "text", content: tail });

  // 无匹配时直接渲染整段
  if (parts.length === 0) parts.push({ type: "text", content: message });

  return (
    <div className="ai-message" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {parts.map((p, i) =>
        p.type === "topic_list" ? (
          <VerticalTabs key={`topic-${i}`} cardContents={p.cardContents} />
        ) : (
          <div key={`text-${i}`} className="ai-message-bubble">
            <ReactMarkdown>{p.content}</ReactMarkdown>
          </div>
        )
      )}
    </div>
  );
}
