import { apiGet } from "./apiClient";

export function getArticles() {
    return apiGet("/api/articles");
}