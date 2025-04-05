import { atom } from 'recoil';

export const agentIdAtom = atom({
  key: 'agentIdAtom',
  default: null,
});

export const agentPhoneAtom = atom({
  key: 'agentPhoneAtom',
  default: '',
});

export const isAgentAvailableAtom = atom({
  key: 'agentAvailableAtom',
  default: false,
});

export const clientServiceAtom = atom({
  key: 'clientServiceAtom',
  default: null,
});

export const agentProfileAtom = atom({
  key: 'agentProfileAtom',
  default: null,
});
