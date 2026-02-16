import { useState, useEffect } from 'react';
import TopicCard from './TopicCard';

function TopicCardList({ topics = [], messageId, metadata }) {
  // 从 metadata 中读取确认状态，如果存在则使用，否则为 null/false
  const confirmedIndex = metadata?.confirmedTopicIndex;
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(confirmedIndex !== undefined);

  useEffect(() => {
    // 当 metadata 变化时，更新确认状态
    if (confirmedIndex !== undefined) {
      setIsConfirmed(true);
      setSelectedIndex(confirmedIndex);
    }
  }, [confirmedIndex]);

  const handleSelect = (index) => {
    // 如果已经确认了某个选题，则不允许再选择
    if (isConfirmed) return;
    
    // 如果点击已选中的卡片，则取消选中；否则选中新卡片
    setSelectedIndex((prev) => (prev === index ? null : index));
  };

  const handleConfirm = async (index) => {
    // 标记为已确认，禁用所有卡片的交互
    setIsConfirmed(true);
    
    // 如果有 messageId，则更新后端 metadata
    if (messageId) {
      try {
        await fetch(`/api/v1/messages/${messageId}/metadata`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metadata: {
              confirmedTopicIndex: index
            }
          })
        });
      } catch (error) {
        console.error('更新 metadata 失败:', error);
      }
    }
  };

  return (
    <div className="flex flex-col">
      {topics.map((topicData, index) => (
        <TopicCard
          key={`topic-${index}`}
          cardContents={topicData}
          isSelected={selectedIndex === index}
          onSelect={() => handleSelect(index)}
          isConfirmed={isConfirmed}
          onConfirm={() => handleConfirm(index)}
        />
      ))}
    </div>
  );
}

export default TopicCardList;

