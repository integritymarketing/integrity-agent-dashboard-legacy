import { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import AddIcon from "components/icons/add";
import { CarrierField } from "./CarrierField";
import { ProductField } from "./ProductField";
import { StateField } from "./StateField";
import { PlanYearField } from "./PlanYearField";
import { ProducerIdField } from "./ProducerIdField";
import { CancelButton } from "./CancelButton";

import styles from "./styles.module.scss";

function SAAddPermissionForm({ handleCancel, handleAddNew, isAdding }) {
  const [carrier, setCarrier] = useState("");
  const [product, setProduct] = useState("");
  const [state, setState] = useState("");
  const [year, setYear] = useState("");
  const [producerId, setProducerId] = useState("");

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

  return (
    <tbody className={styles.customBody}>
      <tr>
        <CarrierField carrier={carrier} setCarrier={onCarrierChange} />
        <ProductField
          product={product}
          carrier={carrier}
          setProduct={onProductChange}
        />
        <StateField product={product} state={state} setState={onStateChange} />
        <PlanYearField state={state} year={year} setYear={setYear} />
        <ProducerIdField producerId={producerId} />
        <CancelButton OnCancelClickHandle={OnCancelClickHandle} />
        <td>
          <Box className={styles.customBodyRow}>
            <Grid
              display="flex"
              alignItems="center"
              onClick={OnAddClickHandle}
              className={styles.link}
              gap={1}
            >
              <Box>Add</Box>
              <AddIcon color="#4178FF" />
            </Grid>
          </Box>
        </td>
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
