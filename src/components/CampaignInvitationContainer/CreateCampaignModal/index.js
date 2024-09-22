import { useState } from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import styles from "./styles.module.scss";
import TextInput from "../../MuiComponents/TextInput";
import { CustomModal } from "components/MuiComponents";
import ContinueIcon from "components/icons/Continue";

function CreateCampaignModal({ isModalOpen, setIsModalOpen, actionButtonName = "Create", onSave, onTextChange }) {
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
        <CustomModal
            title="Create Campaign"
            open={isModalOpen}
            handleClose={handleCloseModal}
            showCloseButton
            maxWidth="sm"
            disableContentBackground
            footer
            handleSave={handleCreateCampaign}
            shouldShowCancelButton={true}
            isSaveButtonDisabled={campaignName.length === 0}
            saveLabel={actionButtonName}
            footerActionIcon={<ContinueIcon />}
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
        </CustomModal>
    );
}

CreateCampaignModal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
    actionButtonName: PropTypes.string,
    onSave: PropTypes.func,
    onTextChange: PropTypes.func,
};

export default CreateCampaignModal;
