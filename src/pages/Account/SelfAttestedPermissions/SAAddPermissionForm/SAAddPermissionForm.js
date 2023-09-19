import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import AddIcon from "components/icons/add";
import { CarrierField } from "./CarrierField";
import { ProductField } from "./ProductField";
import { StateField } from "./StateField";
import { PlanYearField } from "./PlanYearField";
import { ProducerIdField } from "./ProducerIdField";

import styles from "./styles.module.scss";

function SAAddPermissionForm({ handleCancel, handleAddNew, isAdding }) {
  if (!isAdding) return <></>;

  return (
    <tbody className={styles.customBody}>
      <tr>
        <CarrierField />
        <ProductField />
        <StateField />
        <PlanYearField />
        <ProducerIdField />
        <td>
          <Box className={styles.customBodyRow} onClick={handleCancel}>Cancel</Box>
        </td>
        <td>
          <Box className={styles.customBodyRow}>
            <Grid
              display="flex"
              alignItems="center"
              onClick={handleAddNew}
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
  handleCancel:  PropTypes.func,
  handleAddNew: PropTypes.func,
  isAdding: PropTypes.bool,
};

export default SAAddPermissionForm;
