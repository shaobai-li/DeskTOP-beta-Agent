export const mockChatList = [
    { chatId: "1", title: "AI选题灵感", updatedAt: "2025-11-11T10:00:00Z" },
    { chatId: "2", title: "短视频脚本生成", updatedAt: "2025-11-10T14:00:00Z" },
    { chatId: "3", title: "内容排期策划", updatedAt: "2025-11-09T09:00:00Z" },
];

export const mockMessages = [
    {
        messageId: "m1",
        chatId: "1",
        role: "user",
        content: "你好，我想要一些自媒体选题灵感。",
    },
    {
        messageId: "m2",
        chatId: "1",
        role: "assistant",
        content: "当然，这里有三个科技趋势类选题供你参考……",
    },
    {
        messageId: "m3",
        chatId: "2",
        role: "user",
        content: "帮我生成一个短视频脚本。",
    },
    {
        messageId: "m4",
        chatId: "2",
        role: "assistant",
        content: "好的，这是一份脚本草案，开头采用悬念引入……",
    },
    {
        messageId: "m5",
        chatId: "3",
        role: "assistant",
        content: `思考一下，下面的选题您感兴趣么？
        <topic_list><topic><title>【选题1】标题：跨模态AI技术如何塑造未来数字产品</title>
<subtitle>
- 灵感来源：<text 1>, <text 2>
- 核心观点：跨模态能力的AI正在重塑产品界面和用户体验，带来更多创新机会。
- 内容方向：探讨跨模态技术在实际应用中的具体案例，如AI生成的播客、视频，以及未来可能的演变路径。
- 受众价值：启发数字产品开发者探索新技术应用，拓宽产品创新方向。
</subtitle></topic>
</topic_list>`
    },
];