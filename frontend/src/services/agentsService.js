import { apiGet, apiPatch, apiPost } from "./apiClient";

export function getAgents() {
    return apiGet("/api/agents");
}

export function updateAgent(agentId, body) {
    return apiPatch(`/api/agents/${agentId}`, body);
}

export function createAgent(body) {
    return apiPost("/api/agents", body);
}