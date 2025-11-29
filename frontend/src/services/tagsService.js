import { apiGet, apiPost } from "./apiClient";  

export function getTags() {
    return apiGet("/api/tags");
}

export function createTag(tagData) {
  return apiPost("/api/tags", tagData);   
}