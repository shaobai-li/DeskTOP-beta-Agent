import { apiGet, apiPatch } from "./apiClient";

export function getAgents() {
    return apiGet("/api/agents");
}

export function updateAgent(agentId, updateData) {
    return apiPatch(`/api/agents/${agentId}`, updateData);
}