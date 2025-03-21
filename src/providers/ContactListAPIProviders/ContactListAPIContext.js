import { useContext } from 'react';

import { ContactListAPIContext } from './ContactListAPIProviders';

export const useContactListAPI = () => useContext(ContactListAPIContext) ?? {};
