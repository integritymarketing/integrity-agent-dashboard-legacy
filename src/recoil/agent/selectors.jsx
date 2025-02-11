import { selector } from "recoil";
import { agentIdAtom, clientServiceAtom } from "./atoms";
import * as Sentry from "@sentry/react";

export const agentInformationSelector = selector({
    key: "agentInformationSelector",
    default: { isLoading: true },
    get: async ({ get }) => {
        const agentId = get(agentIdAtom);
        const clientsService = get(clientServiceAtom);
        if (!agentId) {
            return {
                isLoading: true,
            };
        }
        try {
            const result = await clientsService.getAgentAvailability(agentId);
            return { ...result, isLoading: false };
        } catch (error) {
            Sentry.captureException(error);
            return {};
        }
    },
});
