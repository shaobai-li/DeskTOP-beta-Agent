import { apiGet, apiPatch, apiDelete } from "./apiClient";

export function getChats() {
    return apiGet("/chats");
}

export function updateChat(chatId, body) {
    return apiPatch(`/chat/${chatId}`, body);
}

export function deleteChat(chatId) {
    return apiDelete(`/chat/${chatId}`);
}

