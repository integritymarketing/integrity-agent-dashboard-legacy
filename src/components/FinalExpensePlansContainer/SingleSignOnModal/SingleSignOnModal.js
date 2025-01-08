/* eslint-disable max-lines-per-function */
import { useState } from "react";

import PropTypes from "prop-types";

import Box from "@mui/material/Box";

import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import useDeviceType from "hooks/useDeviceType";
import useUserProfile from "hooks/useUserProfile";

import Textfield from "components/ui/textfield";
import Modal from "components/Modal";
import Spinner from "components/ui/Spinner";

import { StyledButton } from "pages/FinalExpensesPage/Components/StyledComponents";

import styles from "./index.module.scss";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleArrowRight} from "@awesome.me/kit-7ab3488df1/icons/classic/light";

const AGENTS_API_VERSION = "v1.0";

export const SingleSignOnModal = ({
    isOpen,
    onClose,
    carrierInfo,
    resourceUrl,
    onApply,
    fetchPlans,
    setIsSingleSignOnInitialModalOpen,
}) => {
    const [isContinuing, setIsContinuing] = useState(false);
    const [error, setError] = useState(null);
    const [producerId, setProducerId] = useState("");
    const showToast = useToast();
    const { npn } = useUserProfile();
    const { isMobile } = useDeviceType();

    const URL = `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentsSelfService/fexAttestation/${npn}`;

    const { Post: addSALifeRecord } = useFetch(URL);

    const shouldDisable = !producerId || isContinuing || error;

    const onChange = (e) => {
        const inputValue = e.target.value;
        setProducerId(inputValue);
    };

    const validateInput = (input) => {
        const alphanumericRegex = /^[a-z0-9]+$/i;
        if (input.length < 1 || input.length > 13) {
            return "Input must be between 1 and 13 characters long.";
        }
        if (!alphanumericRegex.test(input)) {
            return "Input must contain only alphanumeric characters.";
        }
        return null;
    };

    const onBlur = () => {
        const validatedError = validateInput(producerId);
        if (validatedError) {
            setError(validatedError);
        } else {
            setError(null);
        }
    };

    const onContinueWithIdHandle = async () => {
        setIsContinuing(true);
        const payload = {
            agentNPN: npn,
            carrierName: carrierInfo?.name,
            displayCarrierName: carrierInfo?.name,
            carrierId: carrierInfo?.id,
            productNames: [],
            producerId: producerId,
            isSelfAttested: "Yes",
            inActive: 0,
            naic: carrierInfo?.naic,
        };
        const res = await addSALifeRecord(payload, true);
        try {
            if (res.ok) {
                await onApply(producerId);
                await fetchPlans();
                setIsContinuing(false);
                onClose();
            }
            if (res.status === 400) {
                setIsContinuing(false);
                setIsSingleSignOnInitialModalOpen(true);
                onClose();
                showToast({
                    type: "error",
                    message: "Failed to add record",
                    time: 10000,
                });
            }
        } catch (e) {
            setIsContinuing(false);
            onClose();
            showToast({
                type: "error",
                message: "Failed to add record",
                time: 10000,
            });
        }
    };

    const onContinueWithoutIdHandle = () => {
        onClose();
        window.open(resourceUrl, "_blank");
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Single Sign On"
            size="wide"
            hideFooter
            contentStyle={{ borderRadius: "8px" }}
        >
            {!isMobile && (
                <Box className={styles.modalContentHeader}>Update your Producer ID for an Improved Experience</Box>
            )}
            <Box className={styles.modalContent}>
                {isMobile && (
                    <Box className={styles.modalContentHeaderMobile}>
                        Update your Producer ID for an Improved Experience
                    </Box>
                )}
                {isContinuing && <Spinner />}
                {!isContinuing && (
                    <>
                        <Box>Updating your Producer ID for this Carrier and Product helps you to:</Box>
                        <ul className={styles.listStyle}>
                            <li>Filter the Quote results by the Products and Carriers you are contracted with</li>
                            <li>Gain Single Sign On to select Carriers and Product Websites</li>
                            <li>Automatically link Policies from this Carrier and Product to your Account</li>
                        </ul>
                        <Box className={styles.actions}>
                            <Box>
                                <Box className={styles.label}>Producers ID/ Writing Number (AWN)</Box>
                                <Textfield
                                    value={producerId}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    placeholder="Enter your ID Number"
                                />
                                {error && <Box className={styles.errorMessage}>{error}</Box>}
                            </Box>
                            <StyledButton onClick={onContinueWithIdHandle} disabled={shouldDisable}>
                                <span>Continue with Producers ID</span>
                                <FontAwesomeIcon icon={faCircleArrowRight} size={"xl"}/>
                            </StyledButton>
                            <Box className={styles.link} onClick={onContinueWithoutIdHandle}>
                                Continue without Producer ID
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
};

SingleSignOnModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    carrierInfo: PropTypes.object,
    resourceUrl: PropTypes.string,
    onApply: PropTypes.func,
    fetchPlans: PropTypes.func,
};

SingleSignOnModal.defaultProps = {
    isOpen: false,
};

export default SingleSignOnModal;
