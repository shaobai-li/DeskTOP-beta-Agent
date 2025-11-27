import { apiPost } from "./apiClient";

export function beginChat(body) {
    return apiPost("/api/messages/begin", body);
}

export function streamChat(body) {
    return apiPost("/api/messages/stream", body, { stream: true });
}

export function getMessages(chatId) {
    return apiGet(`/api/messages/${chatId}`);
}