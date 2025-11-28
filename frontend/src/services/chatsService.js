import { apiGet, apiPatch, apiDelete } from "./apiClient";

export function getChats() {
    return apiGet("/api/chats");
}

export function updateChat(chatId, body) {
    return apiPatch(`/api/chat/${chatId}`, body);
}

export function deleteChat(chatId) {
    return apiDelete(`/api/chat/${chatId}`);
}

