import { useState } from "react";
import "./VerticalTabs.css";
import ReactMarkdown from "react-markdown";

function VerticalTabs({ cardContents = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const options = cardContents.map((content) => ({
    title: `💡 ${content.title}`,
    description: content.subtitle,
  }));

  return (
    <div className="verticaltabs-vertical-tabs">
      {options.length === 0 ? (
        <div className="verticaltabs-empty">暂无选项内容</div>
      ) : (
        options.map((option, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`verticaltabs-tab-button ${
              activeIndex === index ? "active" : ""
            }`}
          >
            <div className="verticaltabs-option-title">{option.title}</div>
            <div className="verticaltabs-option-description">
              <ReactMarkdown>{option.description}</ReactMarkdown>
            </div>
          </button>
        ))
      )}
    </div>
  );
}

export default VerticalTabs;
