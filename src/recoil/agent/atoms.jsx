import { atom } from "recoil";

export const agentIdAtom = atom({
    key: "agentIdAtom",
    default: null,
});

export const agentPhoneAtom = atom({
    key: "agentPhoneAtom",
    default: "",
});

export const isAgentAvailableAtom = atom({
    key: "agentAvilableAtom",
    default: false,
});

export const clientServiceAtom = atom({
    key: "clientServiceAtom",
    default: null,
});
