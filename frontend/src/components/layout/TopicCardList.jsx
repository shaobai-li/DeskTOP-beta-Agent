import { useState } from 'react';
import TopicCard from './TopicCard';

function TopicCardList({ topics = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleSelect = (index) => {
    // 如果点击已选中的卡片，则取消选中；否则选中新卡片
    setSelectedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex flex-col">
      {topics.map((topicData, index) => (
        <TopicCard
          key={`topic-${index}`}
          cardContents={topicData}
          isSelected={selectedIndex === index}
          onSelect={() => handleSelect(index)}
        />
      ))}
    </div>
  );
}

export default TopicCardList;

