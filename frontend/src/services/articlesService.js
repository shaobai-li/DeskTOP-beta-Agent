import { apiGet, apiPost } from "./apiClient";

export function getArticles() {
    return apiGet("/api/articles");
}

export function createArticle(articleData) {
    return apiPost("/api/articles", articleData);
}