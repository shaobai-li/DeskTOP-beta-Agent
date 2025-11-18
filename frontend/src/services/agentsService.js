import { apiGet } from "./apiClient";

export function getAgents() {
    return apiGet("/api/agents");
}