import { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import { useWindowSize } from "hooks/useWindowSize";
import { CarrierField } from "./CarrierField";
import { ProductField } from "./ProductField";
import { StateField } from "./StateField";
import { PlanYearField } from "./PlanYearField";
import { ProducerIdField } from "./ProducerIdField";
import { CancelButton } from "./CancelButton";
import { AddButton } from "./AddButton";
import useSelectOptions from "../hooks/useSelectOptions";

import styles from "./styles.module.scss";

function SAAddPermissionForm({ handleCancel, handleAddNew, isAdding, agents }) {
  const [carrier, setCarrier] = useState("");
  const [product, setProduct] = useState("");
  const [state, setState] = useState("");
  const [year, setYear] = useState("");
  const { width: windowWidth } = useWindowSize();
  const {
    carriersOptions,
    getProductsOptions,
    getPlanYearOptions,
    getProducerID,
  } = useSelectOptions(agents);
  const productsOptions = getProductsOptions(carrier);
  const planYearOptions = getPlanYearOptions(carrier);
  const producerId = getProducerID(carrier);

  const isMobile = windowWidth <= 784;

  const resetAllFields = () => {
    setCarrier("");
    setProduct("");
    setState("");
    setYear("");
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

  return (
    <>
      {!isMobile && (
        <tbody className={styles.customBody}>
          <tr>
            <td>
              <CarrierField
                carrier={carrier}
                setCarrier={onCarrierChange}
                options={carriersOptions}
              />
            </td>
            <td>
              <ProductField
                product={product}
                carrier={carrier}
                setProduct={onProductChange}
                options={productsOptions}
              />
            </td>
            <td>
              <StateField
                product={product}
                state={state}
                setState={onStateChange}
              />
            </td>
            <td>
              <PlanYearField
                state={state}
                year={year}
                setYear={setYear}
                options={planYearOptions}
              />
            </td>
            <td>
              <ProducerIdField producerId={producerId} />
            </td>
            <td>
              <CancelButton OnCancelClickHandle={OnCancelClickHandle} />
            </td>
            <td>
              <AddButton OnAddClickHandle={OnAddClickHandle} />
            </td>
          </tr>
        </tbody>
      )}
      {isMobile && (
        <Box className={styles.mobileContainer}>
          <CarrierField
            carrier={carrier}
            setCarrier={onCarrierChange}
            options={carriersOptions}
            isMobile={isMobile}
          />
          <ProductField
            product={product}
            carrier={carrier}
            setProduct={onProductChange}
            options={productsOptions}
            isMobile={isMobile}
          />
          <StateField
            product={product}
            state={state}
            setState={onStateChange}
            isMobile={isMobile}
          />
          <PlanYearField
            state={state}
            year={year}
            setYear={setYear}
            options={planYearOptions}
            isMobile={isMobile}
          />
          <ProducerIdField producerId={producerId} isMobile={isMobile} />
          <CancelButton
            OnCancelClickHandle={OnCancelClickHandle}
            isMobile={isMobile}
          />
          <AddButton OnAddClickHandle={OnAddClickHandle} isMobile={isMobile} />
        </Box>
      )}
    </>
  );
}

SAAddPermissionForm.propTypes = {
  handleCancel: PropTypes.func,
  handleAddNew: PropTypes.func,
  isAdding: PropTypes.bool,
  agents: PropTypes.array,
};

export default SAAddPermissionForm;
