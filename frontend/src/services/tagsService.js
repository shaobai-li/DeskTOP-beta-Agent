import { apiGet, apiPost, apiPut, apiDelete } from "./apiClient";  

export function getTags() {
    return apiGet("/tags");
}

export function createTag(tagData) {
  return apiPost("/tags", tagData);   
}

export function updateTag(tagId, tagData) {
  return apiPut(`/tags/${tagId}`, tagData);
}

export function deleteTag(tagId) {
  return apiDelete(`/tags/${tagId}`);
}