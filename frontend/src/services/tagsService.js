import { apiGet, apiPost } from "./apiClient";  

export function getTags() {
    return apiGet("/tags");
}

export function createTag(tagData) {
  return apiPost("/tags", tagData);   
}