import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import * as Sentry from "@sentry/react";

import TrashBinIcon from "components/icons/trashbin";
import useUserProfile from "hooks/useUserProfile";
import useToast from "hooks/useToast";
import useFetch from "hooks/useFetch";
import { useSAPermissionsContext } from "../SAPermissionProvider";

import styles from "./styles.module.scss";

const AGENTS_API_VERSION = "v1.0";
function DeleteButton({ attestationId }) {
  const { fetchTableData, setIsLoading } = useSAPermissionsContext();
  const addToast = useToast();
  const { agentId } = useUserProfile();

  const URL = `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentsSelfService/attestation/${agentId}/${attestationId}`;

  const { Delete: deleteAgentSelfAttestation } = useFetch(URL);

  const onDeleteHandle = async () => {
    try {
      setIsLoading(true)
      await deleteAgentSelfAttestation();
      await fetchTableData();
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
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
  attestationId: PropTypes.number,
};

export default DeleteButton;
