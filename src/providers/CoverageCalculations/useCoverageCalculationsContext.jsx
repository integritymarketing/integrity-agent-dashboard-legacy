import { useContext } from 'react';
import { CoverageCalculationsContext } from './CoverageCalculationsProvider';

export const useCoverageCalculationsContext = () =>
  useContext(CoverageCalculationsContext) ?? {};
