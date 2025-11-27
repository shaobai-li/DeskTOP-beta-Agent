import { useState, useEffect } from "react";
import { getAgentsMenu } from '@services/agentsService';

export const useChatAgents = () => {
    const [availableAgents, setAvailableAgents] = useState([]);
    const [selectedAgentId, setSelectedAgentId] = useState(null);

    useEffect(() => {
        async function loadAvailableAgents() {
            const { data, error } = await getAgentsMenu();
            if (error) {
                console.error("加载知能体失败：", error);
                return;
            }
            setAvailableAgents(data);
        }
        loadAvailableAgents();
    }, []);

    return { availableAgents, selectedAgentId, setSelectedAgentId };
};