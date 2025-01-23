import { useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PropTypes from "prop-types";

import { Button } from "components/ui/Button";
import { Select } from "components/ui/Select";
import Modal from "components/ui/modal";

import styles from "./styles.module.scss";

const LostStageDispositionModal = ({ subStatuses = [], open, onClose, onSubmit }) => {
    const [selectedSubStatus, setSelectedSubStatus] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (onSubmit) {
            const filteredSubStatus = subStatuses
                .filter(({ value }) => value === selectedSubStatus)
                .map(({ value, label }) => ({
                    leadStatusId: value,
                    leadStatusName: label,
                }));
            onSubmit("Lost", filteredSubStatus);
        }
    };

    const handleClose = () => {
        setSelectedSubStatus(null);
        onClose();
    };

    return (
        <Modal open={open} size="small" onClose={handleClose} className={styles.lostStageModal}>
            <Typography variant="h4">Lost Contact</Typography>
            <Box className={styles.lostStageModalContent}>
                <Box> Select the reason why</Box>
                <Select
                    containerHeight={250}
                    options={subStatuses}
                    placeholder="Select"
                    showValueAlways={true}
                    onChange={setSelectedSubStatus}
                    initialValue={selectedSubStatus}
                />
            </Box>
            <Box className={styles.footerButtons}>
                <Button disabled={!selectedSubStatus} label="Submit" onClick={handleSubmit} />
                <Button label="Cancel" onClick={handleClose} type="secondary" />
            </Box>
        </Modal>
    );
};

LostStageDispositionModal.propTypes = {
    subStatuses: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.any.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default LostStageDispositionModal;
