import { useState } from "react";

import PropTypes from "prop-types";

import Box from "@mui/material/Box";

import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import { useWindowSize } from "hooks/useWindowSize";
import useUserProfile from "hooks/useUserProfile";

import Textfield from "components/ui/textfield";
import Modal from "components/Modal";

import { StyledButton } from "pages/FinalExpensesPage/Components/StyledComponents";

import EnrollBack from "images/enroll-btn-back.svg";

import styles from "./index.module.scss";

const AGENTS_API_VERSION = "v1.0";

export const SingleSignOnModal = ({ isOpen, onClose, carrierInfo, resourceUrl, onApply, setIsRTS }) => {
    const [producerId, setProducerId] = useState("");
    const showToast = useToast();
    const { npn } = useUserProfile();
    const { width: windowWidth } = useWindowSize();

    const isMobile = windowWidth <= 784;

    const URL = `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentsSelfService/fexAttestation/${npn}`;

    const { Post: addSALifeRecord } = useFetch(URL);

    const shouldDisable = !producerId;

    const onChange = (e) => {
        const inputValue = e.target.value;
        setProducerId(inputValue);
    };

    const onContinueWithIdHandle = async () => {
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
        if (res.ok) {
            setIsRTS(true);
            await onApply();
            onClose();
        } else {
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
        <Modal open={isOpen} onClose={onClose} title="Single Sign On" size="wide" hideFooter>
            {!isMobile && (
                <Box className={styles.modalContentHeader}>Update your Producer ID for an Improved Experience</Box>
            )}
            <Box className={styles.modalContent}>
                {isMobile && (
                    <Box className={styles.modalContentHeaderMobile}>
                        Update your Producer ID for an Improved Experience
                    </Box>
                )}
                <Box>Updating your Producer ID for this Carrier and Product helps you to:</Box>
                <ul className={styles.listStyle}>
                    <li>Filter the Quote results by the Products and Carriers you are contracted with</li>
                    <li>Gain Single Sign On to select Carriers and Product Websites</li>
                    <li>Automatically link Policies from this Carrier and Product to your Account</li>
                </ul>
                <Box className={styles.actions}>
                    <Box>
                        <Box className={styles.label}>Producers ID/ Writing Number (AWN)</Box>
                        <Textfield value={producerId} onChange={onChange} placeholder="Enter your ID Number" />
                    </Box>
                    <StyledButton onClick={onContinueWithIdHandle} disabled={shouldDisable}>
                        <span>Continue with Producers ID</span>
                        <img src={EnrollBack} alt="arrow" />
                    </StyledButton>
                    <Box className={styles.link} onClick={onContinueWithoutIdHandle}>
                        Continue without Producer ID
                    </Box>
                </Box>
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
    setIsRTS: PropTypes.func,
};

SingleSignOnModal.defaultProps = {
    isOpen: false,
};

export default SingleSignOnModal;
