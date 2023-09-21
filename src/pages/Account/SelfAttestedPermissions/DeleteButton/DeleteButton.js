import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import * as Sentry from "@sentry/react";
import agentsSelfService from "services/agentsSelfService";
import useUserProfile from "hooks/useUserProfile";
import useToast from "hooks/useToast";
import TrashBinIcon from "components/icons/trashbin";

import styles from "./styles.module.scss";

function DeleteButton({ attestationId, fetchTableData }) {
  const addToast = useToast();
  const { agentId } = useUserProfile();

  const onDeleteHandle = async () => {
    try {
      await agentsSelfService.deleteAgentSelfAttestation(
        agentId,
        attestationId
      );
      await fetchTableData();
    } catch (error) {
      Sentry.captureException(error);
      addToast({
        type: "error",
        message: "Failed to delete record",
        time: 10000,
      });
    }
  };

  return (
    <Grid
      display="flex"
      alignItems="center"
      className={styles.link}
      gap={1}
      onClick={onDeleteHandle}
    >
      <Box>Delete</Box>
      <TrashBinIcon color="#4178ff" />
    </Grid>
  );
}

DeleteButton.propTypes = {
  fetchTableData: PropTypes.func,
  attestationId: PropTypes.number,
};

export default DeleteButton;
