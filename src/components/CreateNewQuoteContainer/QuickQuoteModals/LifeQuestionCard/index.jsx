import { useEffect, useMemo, useState } from 'react';
import SelectionList from '../../Common/SelectionList';
import { LIFE_QUESTION_CARD_LIST, LIFE_CARRIER_BASED_LIST } from './constants';
import { useCarriers } from 'providers/CarriersProvider';
import WithLoader from 'components/ui/WithLoader';

const CARRIERS_PRODUCTS_FLAG =
  import.meta.env.VITE_CARRIERS_PRODUCTS_FLAG === 'show';

const LifeQuestionCard = ({ handleSelectLifeProductType }) => {
  const { getCarriersData, isLoadingGetCarriers } = useCarriers();
  const [carriersData, setCarriersData] = useState([]);

  useEffect(() => {
    const fetchCarriers = async () => {
      const response = await getCarriersData(
        'productType=gul&productType=term'
      );
      if (response) {
        setCarriersData(response);
      }
    };
    fetchCarriers();
  }, []);

  const isExistIulCarriers = useMemo(() => {
    return carriersData?.some(carrier =>
      carrier?.productCategory?.includes('IUL')
    );
  }, [carriersData]);

  const isExistTermCarriers = useMemo(() => {
    return carriersData?.some(carrier =>
      carrier?.productCategory?.includes('Term')
    );
  }, [carriersData]);

  const isExistGulCarriers = useMemo(() => {
    return carriersData?.some(carrier =>
      carrier?.productCategory?.includes('GUL')
    );
  }, [carriersData]);

  const isExistSiulCarriers = useMemo(() => {
    return carriersData?.some(carrier =>
      carrier?.productCategory?.includes('SIUL')
    );
  }, [carriersData]);

  console.log('isExistIulCarriers', carriersData);
  console.log('isExistTermCarriers', isExistTermCarriers);
  console.log('isExistGulCarriers', isExistGulCarriers);
  console.log('isExistSiulCarriers', isExistSiulCarriers);

  const updatedLifeQuestionCardList = useMemo(() => {
    const lifeQuestionCardList = { ...LIFE_CARRIER_BASED_LIST };
    if (!isExistIulCarriers) {
      delete lifeQuestionCardList.FULLY_IUL;
    }
    if (!isExistTermCarriers) {
      delete lifeQuestionCardList.TERM_LIFE;
    }
    if (!isExistGulCarriers) {
      delete lifeQuestionCardList.GUARANTEED_UL;
    }
    if (!isExistSiulCarriers) {
      delete lifeQuestionCardList.SIMPLIFIED_IUL;
    }
    return lifeQuestionCardList;
  }, [
    isExistIulCarriers,
    isExistTermCarriers,
    isExistGulCarriers,
    isExistSiulCarriers,
  ]);

  const cardsList = CARRIERS_PRODUCTS_FLAG
    ? Object.values(updatedLifeQuestionCardList).slice(0, 4)
    : Object.values(LIFE_QUESTION_CARD_LIST);

  return (
    <WithLoader isLoading={isLoadingGetCarriers}>
      <SelectionList
        title='What type of Life Product?'
        selectionList={cardsList}
        handleSelectItem={handleSelectLifeProductType}
        gridSize={CARRIERS_PRODUCTS_FLAG && cardsList?.length !== 1 ? 6 : 12}
      />
    </WithLoader>
  );
};

export default LifeQuestionCard;
