import { atom } from "recoil";

export const agentIdAtom = atom({
  key: "agentIdAtom",
  default: null,
});

export const welcomeModalOpenAtom = atom({
  key: "welcomeModalOpenAtom",
  default: false,
});

export const agentPhoneAtom = atom({
  key: "agentPhoneAtom",
  default: "",
});

export const isAgentAvailableAtom = atom({
  key: "agentAvilableAtom",
  default: false,
});
