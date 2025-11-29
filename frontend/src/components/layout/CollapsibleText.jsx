import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function CollapsibleText({ content }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative my-2 p-3 pr-10 bg-neutral-100 border border-neutral-200 rounded-md">
      <div
        className={`overflow-hidden pr-6 text-sm ${
          isExpanded ? "" : "line-clamp-2"
        }`}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
        {!isExpanded && (
          <span className="inline">...</span>
        )}
      </div>
      <button
        className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center text-neutral-900 hover:text-neutral-700 cursor-pointer transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span
          className={`text-base font-mono font-semibold inline-block transition-transform ${
            isExpanded ? "rotate-90" : ""
          }`}
        >
          &gt;
        </span>
      </button>
    </div>
  );
}

