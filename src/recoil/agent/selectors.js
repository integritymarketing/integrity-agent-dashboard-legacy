import { selector } from "recoil";
import { agentIdAtom } from "./atoms";
import clientService from "services/clientsService";
import * as Sentry from "@sentry/react";

export const agentInfomration = selector({
  key: "agentInfomration",
  get: async ({ get }) => {
    const agentId = get(agentIdAtom);
    if (!agentId) return {};
    try {
      const result = await clientService.getAgentAvailability(agentId);
      return result;
    } catch (error) {
      Sentry.captureException(error);
      return {};
    }
  },
});
