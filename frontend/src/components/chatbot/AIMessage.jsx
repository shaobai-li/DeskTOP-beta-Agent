import "./AIMessage.css";
import ReactMarkdown from "react-markdown";
import VerticalTabs from "./VerticalTabs";

export default function AIMessage({ message }) {
  const cardBlockRegex = /<card>([\s\S]*?)<\/card>/gi;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = cardBlockRegex.exec(message)) !== null) {
    const start = match.index;
    const end = cardBlockRegex.lastIndex;

    const textBefore = message.slice(lastIndex, start);
    if (textBefore.trim() !== "") {
      parts.push({ type: "text", content: textBefore });
    }

    const cardRaw = match[1];

    // 提取 <title> 和 <subtitle>，忽略大小写
    const titleMatch = cardRaw.match(/<title>([\s\S]*?)<\/title>/i);
    const subtitleMatch = cardRaw.match(/<subtitle>([\s\S]*?)<\/subtitle>/i);

    // 兼容两种情况
    const title = titleMatch ? titleMatch[1].trim() : cardRaw.trim();
    const subtitle = subtitleMatch ? subtitleMatch[1].trim() : "";

    // 按 VerticalTabs 期望的格式传入
    parts.push({
      type: "card",
      cardContents: [{ title, subtitle }],
    });

    lastIndex = end;
  }

  const tail = message.slice(lastIndex);
  if (tail.trim() !== "") {
    parts.push({ type: "text", content: tail });
  }

  // 没有任何 <card> 的情况也统一处理
  if (parts.length === 0) {
    parts.push({ type: "text", content: message });
  }

  return (
    <div
      className="ai-message"
      style={{
        display: "flex",
        flexDirection: "column", // 垂直排列
        alignItems: "flex-start",
        gap: "8px",
      }}
    >
      {parts.map((p, i) =>
        p.type === "card" ? (
          <VerticalTabs
            key={`card-${i}`}
            cardContents={p.cardContents} // ✅ 注意这里传数组
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
