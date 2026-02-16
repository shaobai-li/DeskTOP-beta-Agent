import ReactMarkdown from "react-markdown";
import Button from "../common/Button";
import { useChatStreaming } from "@hooks/useChatStreaming";
import { useChat } from "@contexts/ChatContext";
import { useParams } from 'react-router-dom';


function TopicCard({ cardContents, isSelected = false, onSelect, isConfirmed = false, onConfirm }) {

  const { actions } = useChat();

  const { chatId } = useParams();
  const selectedAgentId = actions.getSelectedAgentId(chatId);
  const { handleSendMessage } = useChatStreaming(chatId, selectedAgentId);


  const content = cardContents || {};
  const title = `💡 ${content.title || ""}`;
  const description = content.subtitle || "";

  const handleClick = (e) => {
    console.log(cardContents);
    handleSendMessage(JSON.stringify(cardContents));
    // 调用父组件的 onConfirm 回调，标记为已确认
    if (onConfirm) {
      onConfirm();
    }
    e.stopPropagation();
  }

  return (
    <div
      className={`
        border rounded-xl p-4 my-1.5 border-gray-300
        ${isConfirmed ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${isSelected 
          ? 'bg-blue-100' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }
      `}
      onClick={isConfirmed ? undefined : onSelect}
    >
      <div className="text-[15px] font-semibold text-gray-900 mb-2 leading-6">
        {title}
      </div>
      <div className="text-sm text-gray-600">
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>

      {isSelected && !isConfirmed && (
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