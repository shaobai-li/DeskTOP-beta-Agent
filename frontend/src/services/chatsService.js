import { apiGet, apiPatch } from "./apiClient";

export function getChats() {
    return apiGet("/api/chats");
}

export function updateChat(chatId, body) {
    return apiPatch(`/api/chat/${chatId}`, body);
}