import { useEffect, useMemo, useState, useCallback } from 'react';
import SelectionList from '../../Common/SelectionList';
import { LIFE_QUESTION_CARD_LIST } from './constants';
import { useCarriers } from 'providers/CarriersProvider';
import WithLoader from 'components/ui/WithLoader';

const CARRIERS_PRODUCTS_FLAG =
  import.meta.env.VITE_CARRIERS_PRODUCTS_FLAG === 'show';

const LifeQuestionCard = ({ handleSelectLifeProductType }) => {
  const { getCarriersData, isLoadingGetCarriers } = useCarriers();
  const [carriersData, setCarriersData] = useState([]);

  const fetchCarriers = useCallback(async () => {
    try {
      const response = await getCarriersData(
        'productType=gul&productType=term&productType=Annuity'
      );
      if (Array.isArray(response)) {
        setCarriersData(response);
      } else {
        console.error('Unexpected response format:', response);
        setCarriersData([]);
      }
    } catch (error) {
      console.error('Error fetching carriers:', error);
      setCarriersData([]);
    }
  }, [getCarriersData]);

  useEffect(() => {
    fetchCarriers();
  }, [fetchCarriers]);

  const isExistTermCarriers = useMemo(() => {
    return carriersData.some(carrier =>
      carrier?.productCategory?.includes('Term')
    );
  }, [carriersData]);

  const isExistGulCarriers = useMemo(() => {
    return carriersData.some(carrier =>
      carrier?.productCategory?.includes('GUL')
    );
  }, [carriersData]);

  const isExistAnnuitiesCarriers = useMemo(() => {
    return carriersData.some(carrier =>
      carrier?.productCategory?.includes('Annuity')
    );
  }, [carriersData]);

  const updatedLifeQuestionCardList = useMemo(() => {
    const lifeQuestionCardList = { ...LIFE_QUESTION_CARD_LIST };
    if (!isExistTermCarriers) {
      delete lifeQuestionCardList.TERM_LIFE;
    }
    if (!isExistGulCarriers) {
      delete lifeQuestionCardList.GUARANTEED_UL;
    }
    if (!isExistAnnuitiesCarriers) {
      delete lifeQuestionCardList.ANNUITIES;
    }
    return lifeQuestionCardList;
  }, [isExistTermCarriers, isExistGulCarriers, isExistAnnuitiesCarriers]);

  const cardsList = CARRIERS_PRODUCTS_FLAG
    ? Object.values(updatedLifeQuestionCardList)
    : Object.values(LIFE_QUESTION_CARD_LIST).slice(0, 3);

  return (
    <WithLoader isLoading={isLoadingGetCarriers}>
      <SelectionList
        title='What type of Life Product?'
        selectionList={cardsList}
        handleSelectItem={handleSelectLifeProductType}
        gridSize={CARRIERS_PRODUCTS_FLAG ? 6 : 12}
      />
    </WithLoader>
  );
};

export default LifeQuestionCard;
