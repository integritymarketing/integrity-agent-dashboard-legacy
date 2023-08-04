import { selector } from "recoil";
import { agentIdAtom } from "./atoms";
import { useClientServiceContext } from "services/clientServiceProvider";
import * as Sentry from "@sentry/react";

const { clientsService } = useClientServiceContext();

export const agentInfomration = selector({
  key: "agentInfomration",
  get: async ({ get }) => {
    const agentId = get(agentIdAtom);
    if (!agentId) return {};
    try {
      const result = await clientsService.getAgentAvailability(agentId);
      return result;
    } catch (error) {
      Sentry.captureException(error);
      return {};
    }
  },
});
