import "./AIMessage.css"
import ReactMarkdown from "react-markdown";
import VerticalTabs from "./VerticalTabs";

export default function AIMessage({message}) {
    // 检查消息内容是否包含<card>标签
    if (message.includes("<card>") && message.includes("</card>")) {
        // 提取所有卡片内容
        const cardContents = [];
        const cardRegex = /<card>(.*?)<\/card>/g;
        let match;
        
        while ((match = cardRegex.exec(message)) !== null) {
            const cardContent = match[1];
            // 检查是否包含title和subtitle标签
            const titleMatch = cardContent.match(/<title>(.*?)<\/title>/);
            const subtitleMatch = cardContent.match(/<subtitle>(.*?)<\/subtitle>/);
            
            if (titleMatch && subtitleMatch) {
                // 如果包含title和subtitle标签，则提取它们的内容
                cardContents.push({
                    title: titleMatch[1],
                    subtitle: subtitleMatch[1]
                });
            } else {
                // 否则，使用原始内容
                cardContents.push(cardContent);
            }
        }
        
        // 提取卡片前后的消息内容
        const parts = message.split(/<\/?card>/);
        const messageBeforeCard = parts[0];
        
        // 创建一个包含所有内容的数组，按顺序排列
        const contentElements = [];
        
        // 添加第一个卡片前的内容
        if (messageBeforeCard && messageBeforeCard.trim() !== "") {
            contentElements.push(
                <div key="before-card" className="ai-message-bubble">
                    <ReactMarkdown>{messageBeforeCard}</ReactMarkdown>
                </div>
            );
        }
        
        // 添加卡片和卡片之间的内容
        for (let i = 0; i < cardContents.length; i++) {
            // 添加卡片
            contentElements.push(
                <VerticalTabs key={`card-${i}`} cardContents={[cardContents[i]]} />
            );
            
            // 添加卡片后的内容（如果不是最后一个卡片且有内容）
            const afterCardIndex = (i + 1) * 2;
            if (afterCardIndex < parts.length && parts[afterCardIndex] && parts[afterCardIndex].trim() !== "") {
                contentElements.push(
                    <div key={`after-card-${i}`} className="ai-message-bubble">
                        <ReactMarkdown>{parts[afterCardIndex]}</ReactMarkdown>
                    </div>
                );
            }
        }
        
        return (
            <div className="ai-message">
                <div className="ai-message-bubble">
                    {contentElements}
                </div>                
            </div>
        );
    } else {
        // 普通消息，直接渲染
        return (
            <div className="ai-message">
                <div className="ai-message-bubble">
                    <ReactMarkdown>{message}</ReactMarkdown>
                </div>
            </div>
        );
    }
}