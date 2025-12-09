import { apiGet, apiPatch, apiPost, apiDelete } from "./apiClient";

export function getAgents() {
    return apiGet("/agents");
}

export function getAgentsMenu() {
    return apiGet("/agents/menu");
}

export function getAgent(agentId) {
    return apiGet(`/agents/${agentId}`);
}

export function updateAgent(agentId, body) {
    return apiPatch(`/agents/${agentId}`, body);
}

export function createAgent(body) {
    return apiPost("/agents", body);
}

export function deleteAgent(agentId) {
    return apiDelete(`/agents/${agentId}`);
}

export function updateAgentTags(agentId, tagIds) {
    return apiPatch(`/agents/${agentId}/tags`, tagIds);
}

export function saveAgent(agentId, body) {
    return apiPost(`/agents/${agentId}/save`, body);
}