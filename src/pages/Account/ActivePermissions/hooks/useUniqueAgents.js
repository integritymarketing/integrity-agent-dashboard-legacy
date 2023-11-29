import { useMemo } from "react";

const useUniqueAgents = (agents) => {
    const uniqueAgents = useMemo(() => {
        const agentsByStates = Object.values(
            agents.reduce((acc, agent) => {
                const { businessUnit, carrier, planType, planYear, producerId, state, status } = agent;
                const key = `${carrier}-${producerId}-${planYear}`;

                acc[key] = {
                    businessUnit,
                    carrier,
                    planYear,
                    producerId,
                    status,
                    states: {
                        ...(acc[key]?.states ?? {}),
                        [state]: [...new Set([...(acc[key]?.states?.[state] ?? []), planType])],
                    },
                };
                return acc;
            }, {})
        );

        const uniqueResults = agentsByStates.reduce((rows, record) => {
            const statesByPlanTypes = Object.keys(record.states).reduce((acc, state) => {
                const planTypeKey = record.states[state].join("-");
                acc[planTypeKey] = {
                    states: [state, ...(acc[planTypeKey]?.states ?? [])].sort(),
                    planTypes: record.states[state],
                };
                return acc;
            }, {});

            return [
                ...rows,
                ...Object.values(statesByPlanTypes).map((byPlansState) => ({
                    ...record,
                    ...byPlansState,
                })),
            ];
        }, []);

        return uniqueResults;
    }, [agents]);

    return { uniqueAgents };
};

export default useUniqueAgents;
