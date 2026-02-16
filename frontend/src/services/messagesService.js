import { apiPost, apiGet, apiPatch } from "./apiClient";

export function beginChat(body) {
    return apiPost("/messages/begin", body);
}

export function streamChat(body) {
    return apiPost("/messages/stream", body, { stream: true });
}

export function getMessages(chatId) {
    return apiGet(`/messages/${chatId}`);
}

export function updateMessageMetadata(messageId, metadata) {
    return apiPatch(`/messages/${messageId}/metadata`, { metadata });
}