import { apiPatch } from "./apiClient";

export function updateChat(chatId, body) {
    return apiPatch(`/api/chat/${chatId}`, body);
}