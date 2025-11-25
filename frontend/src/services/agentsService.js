import { apiGet, apiPatch } from "./apiClient";

export function getAgents() {
    return apiGet("/api/agents");
}

export function updateAgent(agentId, body) {
    return apiPatch(`/api/agents/${agentId}`, body);
}