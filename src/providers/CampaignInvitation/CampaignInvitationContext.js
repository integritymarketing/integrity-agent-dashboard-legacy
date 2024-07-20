import { useContext } from "react";

import { CampaignInvitationContext } from "./CampaignInvitationProvider";

export const useCampaignInvitation = () => useContext(CampaignInvitationContext) ?? {};
