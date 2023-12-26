import * as Sentry from "@sentry/react";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import useFetch from "hooks/useFetch";
import useUserProfile from "hooks/useUserProfile";

import TrashBinIcon from "components/icons/trashbin";

import styles from "./styles.module.scss";

import { useSAHealthProductContext } from "../providers/SAHealthProductProvider";
import { useSAPModalsContext } from "../providers/SAPModalProvider";

const AGENTS_API_VERSION = "v1.0";
function DeleteButton({ attestationId }) {
    const { fetchTableData, setIsLoading } = useSAHealthProductContext();
    const { setIsErrorModalOpen } = useSAPModalsContext();
    const { agentId } = useUserProfile();

    const URL = `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentsSelfService/attestation/${agentId}/${attestationId}`;

    const { Delete: deleteAgentSelfAttestation } = useFetch(URL);

    const onDeleteHandle = async () => {
        setIsLoading(true);
        const res = await deleteAgentSelfAttestation(null, true);
        if (res.status >= 200 && res.status < 300) {
            await fetchTableData();
            setIsLoading(false);
        } else {
            setIsLoading(false);
            Sentry.captureException(res.statusText);
            setIsErrorModalOpen(true);
        }
    };

    return (
        <Box className={styles.link} onClick={onDeleteHandle}>
            <Box>Delete</Box>
            <TrashBinIcon color="#4178ff" />
        </Box>
    );
}

DeleteButton.propTypes = {
    attestationId: PropTypes.number,
};

export default DeleteButton;
