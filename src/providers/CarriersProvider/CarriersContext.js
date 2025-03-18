import { useContext } from 'react';

import { CarriersContext } from './CarriersProvider';

export const useCarriers = () => useContext(CarriersContext) ?? {};
