    // 标签类型常量
const TAG_TYPES = {
    TOPIC: "topic",
    TEXT: "text",
};

// 消息部分类型常量
export const MESSAGE_PART_TYPES = {
    PLAIN: "plain",
    TOPIC: "topic",
    COLLAPSIBLE: "collapsible",
};

// 通用的 XML/HTML 标签解析函数
const parseXMLTag = (html, tagName, extractor) => {
    try {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const element = doc.querySelector(tagName);
        return element ? extractor(element) : null;
    } catch (error) {
        console.error(`解析 ${tagName} 标签失败:`, error);
        return null;
    }
};

// 解析单个 <topic>
const parseTopic = (topicHTML) => {
    return parseXMLTag(topicHTML, "topic", (topic) => ({
        title: topic.querySelector("title")?.textContent.trim() || "",
        subtitle: topic.querySelector("subtitle")?.textContent.trim() || "",
    }));
};

// 解析单个 <text>
const parseText = (textHTML) => {
    return parseXMLTag(textHTML, "text", (text) => text.textContent.trim() || "");
};

// 标签配置
const TAG_CONFIGS = {
    [TAG_TYPES.TOPIC]: {
        regex: /<topic[^>]*>([\s\S]*?)<\/topic>/gi,
        parser: parseTopic,
        partType: MESSAGE_PART_TYPES.TOPIC,
    },
    [TAG_TYPES.TEXT]: {
        regex: /<text[^>]*>([\s\S]*?)<\/text>/gi,
        parser: parseText,
        partType: MESSAGE_PART_TYPES.COLLAPSIBLE,
    },
};

// 查找所有标签匹配项
const findAllTagMatches = (message) => {
    const allMatches = [];

    Object.entries(TAG_CONFIGS).forEach(([tagType, config]) => {
        const matches = [...message.matchAll(config.regex)];
        matches.forEach((match) => {
        allMatches.push({ ...match, tagType, config });
        });
    });

    return allMatches.sort((a, b) => a.index - b.index);
};

// 解析消息，将消息分割成不同的部分（文本、topic、text等）
export function parseMessage(message) {
    const parts = [];
    let lastIndex = 0;

    // 查找并排序所有标签匹配项
    const allMatches = findAllTagMatches(message);

    // 处理所有匹配项
    allMatches.forEach((match) => {
        const start = match.index;
        const end = start + match[0].length;

        // 标签前面的文本
        const before = message.slice(lastIndex, start).trim();
        if (before) {
        parts.push({ type: MESSAGE_PART_TYPES.PLAIN, content: before });
        }

        // 根据标签配置解析
        const { parser, partType } = match.config;
        const parsedData = parser(match[0]);
        
        if (parsedData) {
        if (partType === MESSAGE_PART_TYPES.TOPIC) {
            parts.push({
            type: partType,
            topicData: parsedData,
            });
        } else {
            parts.push({
            type: partType,
            content: parsedData,
            });
        }
        }

        lastIndex = end;
    });

    // 剩余文本部分
    const tail = message.slice(lastIndex).trim();
    if (tail) {
        parts.push({ type: MESSAGE_PART_TYPES.PLAIN, content: tail });
    }

    return parts;
}

