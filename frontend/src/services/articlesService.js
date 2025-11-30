import { apiGet, apiPost, apiDelete } from "./apiClient";

export function getArticles() {
    return apiGet("/articles");
}

export function createArticle(articleData) {
    return apiPost("/articles", articleData);
}

export function deleteArticle(articleId) {
    return apiDelete(`/articles/${articleId}`);
}

export function rebuildArticlesEmbedding() {
    return apiPost("/articles/embedding");
}