import { apiGet, apiPost, apiDelete } from "./apiClient";

export function getArticles() {
    return apiGet("/api/articles");
}

export function createArticle(articleData) {
    return apiPost("/api/articles", articleData);
}

export function deleteArticle(articleId) {
    return apiDelete(`/api/articles/${articleId}`);
}