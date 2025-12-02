import { apiGet, apiPost, apiDelete, apiPut } from "./apiClient";

export function getArticles() {
    return apiGet("/articles");
}

export function createArticle(articleData) {
    return apiPost("/articles", articleData);
}

export function deleteArticle(articleId) {
    return apiDelete(`/articles/${articleId}`);
}

export function updateArticle(articleId, articleData) {
    return apiPut(`/articles/${articleId}`, articleData);
}

export function rebuildArticlesEmbedding() {
    return apiPost("/articles/embedding");
}