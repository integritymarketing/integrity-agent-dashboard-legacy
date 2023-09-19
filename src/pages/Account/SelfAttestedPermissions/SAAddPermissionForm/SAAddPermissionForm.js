import { useState } from "react";
import PropTypes from "prop-types";

import { CarrierField } from "./CarrierField";
import { ProductField } from "./ProductField";
import { StateField } from "./StateField";
import { PlanYearField } from "./PlanYearField";
import { ProducerIdField } from "./ProducerIdField";
import { CancelButton } from "./CancelButton";
import { AddButton } from "./AddButton";
import useFetchAgentsData from "../hooks/useFetchAgentsData";
import Spinner from "components/ui/Spinner/index";
import useSelectOptions from "../hooks/useSelectOptions";

import styles from "./styles.module.scss";

function SAAddPermissionForm({ handleCancel, handleAddNew, isAdding }) {
  const [carrier, setCarrier] = useState("");
  const [product, setProduct] = useState("");
  const [state, setState] = useState("");
  const [year, setYear] = useState("");
  const [producerId, setProducerId] = useState("");
  const { isLoading, agents } = useFetchAgentsData();
  const { carriersOptions, getProductsOptions, getPlanYearOptions } =
    useSelectOptions(agents);

  const resetAllFields = () => {
    setCarrier("");
    setProduct("");
    setState("");
    setYear("");
    setProducerId("");
  };

  const onCarrierChange = (value) => {
    setCarrier(value);
    setProduct("");
    setState("");
    setYear("");
  };

  const onProductChange = (value) => {
    setProduct(value);
    setState("");
    setYear("");
  };

  const onStateChange = (value) => {
    setState(value);
    setYear("");
  };

  const OnCancelClickHandle = () => {
    resetAllFields();
    handleCancel();
  };

  const OnAddClickHandle = () => {
    handleAddNew();
    resetAllFields();
  };

  if (!isAdding) return <></>;

  if (isLoading) return <Spinner />;

  return (
    <tbody className={styles.customBody}>
      <tr>
        <CarrierField
          carrier={carrier}
          setCarrier={onCarrierChange}
          options={carriersOptions}
        />
        <ProductField
          product={product}
          carrier={carrier}
          setProduct={onProductChange}
          options={getProductsOptions(carrier)}
        />
        <StateField product={product} state={state} setState={onStateChange} />
        <PlanYearField
          state={state}
          year={year}
          setYear={setYear}
          options={getPlanYearOptions(carrier)}
        />
        <ProducerIdField producerId={producerId} />
        <CancelButton OnCancelClickHandle={OnCancelClickHandle} />
        <AddButton OnAddClickHandle={OnAddClickHandle} />
      </tr>
    </tbody>
  );
}

SAAddPermissionForm.propTypes = {
  handleCancel: PropTypes.func,
  handleAddNew: PropTypes.func,
  isAdding: PropTypes.bool,
};

export default SAAddPermissionForm;
