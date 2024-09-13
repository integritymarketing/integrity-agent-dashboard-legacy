import { useState } from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Modal from "../../Modal";
import { InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import styles from "./styles.module.scss";
import TextInput from "../../MuiComponents/TextInput";
import ArrowForwardCircle from "images/Campaigns/arrow-forward-circle.svg";

function CreateCampaignModal({
    isModalOpen,
    setIsModalOpen,
    actionButtonName = "Create",
    cancelButtonName = "Cancel",
    onSave,
    hideFooter = false,
    onTextChange,
}) {
    const [campaignName, setCampaignName] = useState("");
    const maxLength = 96;

    const handleInputChange = (event) => {
        setCampaignName(event.target.value);
        onTextChange(event.target.value);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateCampaign = () => {
        onSave && onSave(campaignName);
        setIsModalOpen(false);
    };

    return (
        <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            title="Create Campaign"
            onSave={handleCreateCampaign}
            actionButtonName={actionButtonName}
            endIcon={<img src={ArrowForwardCircle} alt="Arrow Forward Circle" />}
            actionButtonDisabled={campaignName.length === 0}
            onCancel={handleCloseModal}
            cancelButtonName={cancelButtonName}
            hideFooter={hideFooter}
        >
            <Box className={styles.modalSubHeading}>
                <Typography variant="body1" gutterBottom>
                    Name your campaign and then select create.
                </Typography>
            </Box>

            <Box className={styles.modalContent}>
                <Typography variant="body1" gutterBottom>
                    Campaign Name
                </Typography>
                <TextInput
                    fullWidth
                    variant="outlined"
                    value={campaignName}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: maxLength }}
                    label={""}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography variant="body1">{`${campaignName.length}/${maxLength}`}</Typography>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Modal>
    );
}

CreateCampaignModal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
    actionButtonName: PropTypes.string,
    cancelButtonName: PropTypes.string,
    onSave: PropTypes.func,
    hideFooter: PropTypes.bool,
    onTextChange: PropTypes.func,
};

export default CreateCampaignModal;
