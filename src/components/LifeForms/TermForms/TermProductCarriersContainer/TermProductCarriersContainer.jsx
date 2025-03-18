import { useEffect, useMemo, useState } from 'react';
import { useCarriers } from 'providers/CarriersProvider';
import WithLoader from 'components/ui/WithLoader';
import { CarriersContainer } from 'components/LifeIulQuote/CarriersContainer';

export const TermProductCarriersContainer = () => {
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

  const termCarriersList = useMemo(() => {
    return carriersData?.filter(carrier =>
      carrier?.productCategory?.includes('Term')
    );
  }, [carriersData]);

  console.log('termCarriersList', termCarriersList);

  return (
    <WithLoader isLoading={isLoadingGetCarriers}>
      <CarriersContainer title='Term' carriersList={termCarriersList} />
    </WithLoader>
  );
};
