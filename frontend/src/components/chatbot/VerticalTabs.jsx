import { useState } from "react";
import "./VerticalTabs.css";

function VerticalTabs({ cardContents = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  // 如果没有提供卡片内容，使用默认选项
  const options = cardContents.length > 0 
    ? cardContents.map((content, index) => {
        // 检查content是否为对象（包含title和subtitle）
        if (typeof content === 'object' && content.title && content.subtitle) {
          return {
            title: `💡 ${content.title}`,
            description: content.subtitle
          };
        } else {
          // 兼容旧格式
          return {
            title: `💡 ${content}`,
            description: "这是选项的简短描述"
          };
        }
      })
    : [
        { title: "💡 方案1", description: "这是方案1的简短描述" },
        { title: "💡 方案2", description: "这是方案2的简短描述" },
        { title: "💡 方案3", description: "这是方案3的简短描述" }
      ];

  return (
    <div className="verticaltabs-vertical-tabs">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => setActiveIndex(index)}
          className={`verticaltabs-tab-button ${activeIndex === index ? "active" : ""}`}
        >
          <div className="verticaltabs-option-title">{option.title}</div>
          <div className="verticaltabs-option-description">{option.description}</div>
        </button>
      ))}
    </div>
  );
}

export default VerticalTabs;