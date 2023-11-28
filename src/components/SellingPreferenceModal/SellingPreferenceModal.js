import { captureException } from "@sentry/react";
import { useEffect, useState } from "react";

import { Divider } from "@mui/material";
import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";
import useAgentPreferencesData from "pages/Account/hooks/useAgentPreferencesData";

import Modal from "components/Modal";
import HealthOption from "components/icons/version-2/HealthOption";
import LifeOption from "components/icons/version-2/LifeOption";
import Checkbox from "components/ui/Checkbox";

import styles from "./styles.module.scss";

const LIFE = "hideLifeQuote";
const HEALTH = "hideHealthQuote";

const SellingPreferenceModal = ({ isOpen, onStartQuoteHandle, onClose }) => {
    const [checked, setChecked] = useState(false);
    const { leadPreference, isLoading, updateAgentPreferences } = useAgentPreferencesData();
    const { agentId } = useUserProfile();
    const showToast = useToast();

    const shouldShowModal = !leadPreference?.hideHealthQuote && !leadPreference?.hideLifeQuote;

    const onSelectHandle = async (type) => {
        try {
            const updatedType = type === LIFE ? HEALTH : LIFE;
            const payload = {
                agentID: agentId,
                leadPreference: {
                    ...leadPreference,
                    [updatedType]: true,
                },
            };
            await updateAgentPreferences(payload);
            onStartQuoteHandle();
        } catch (error) {
            showToast({
                type: "error",
                message: "Failed to save the preferences.",
                time: 10000,
            });
            captureException(error);
        }
    };

    useEffect(() => {
        if (!shouldShowModal && !isLoading && isOpen) {
            onStartQuoteHandle();
        }
    }, [isLoading, isOpen, onStartQuoteHandle, shouldShowModal]);

    if (!shouldShowModal || isLoading || !isOpen) {
        return <></>;
    }

    return (
        <Modal maxWidth="sm" open={isOpen} onClose={onClose} hideFooter title="Choose Plan Type">
            <Box className={styles.content}>
                <Box display="flex" flexDirection="column" gap="10px" alignItems="center">
                    <Box className={styles.option} onClick={() => onSelectHandle(LIFE)}>
                        <LifeOption />
                    </Box>
                    <Box className={styles.label}>Life</Box>
                </Box>
                <Box display="flex" flexDirection="column" gap="10px" alignItems="center">
                    <Box className={styles.option} onClick={() => onSelectHandle(HEALTH)}>
                        <HealthOption />
                    </Box>
                    <Box className={styles.label}>Health</Box>
                </Box>
            </Box>
            <Divider />
            <Box display="flex" gap="0px" alignItems="center" justifyContent="center" marginTop="30px">
                <Checkbox label="Don't show this again" checked={checked} onChange={() => setChecked(!checked)} />
            </Box>
        </Modal>
    );
};

SellingPreferenceModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onStartQuoteHandle: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default SellingPreferenceModal;
