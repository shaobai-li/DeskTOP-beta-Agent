import { apiGet, apiPatch, apiPost, apiDelete } from "./apiClient";

export function getAgents() {
    return apiGet("/api/agents");
}

export function getAgentsMenu() {
    return apiGet("/api/agents/menu");
}

export function getAgent(agentId) {
    return apiGet(`/api/agents/${agentId}`);
}

export function updateAgent(agentId, body) {
    return apiPatch(`/api/agents/${agentId}`, body);
}

export function createAgent(body) {
    return apiPost("/api/agents", body);
}

export function deleteAgent(agentId) {
    return apiDelete(`/api/agents/${agentId}`);
}