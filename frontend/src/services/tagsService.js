import { apiGet } from "./apiClient";

export function getTags() {
    return apiGet("/api/tags");
}