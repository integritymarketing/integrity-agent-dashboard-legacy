import PropTypes from "prop-types";
import { Button, Typography, Box } from "@mui/material";
import styles from "./styles.module.scss";
import { CustomModal } from "components/MuiComponents";
import { ContactLink } from "@integritymarketing/icons";

function UnlinkedTextModal({ isModalOpen, setIsModalOpen, linkToContact, smsContent, date, time }) {
    return (
        <CustomModal
            title="Unlinked Text Message"
            open={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
            showCloseButton
            maxWidth="sm"
            disableContentBackground
            footer={null}
        >
            <Box className={styles.textModalBody}>
                <Box>
                    <Typography variant="h4" className={styles.textHeader}>
                        Message Received
                    </Typography>
                </Box>
                <Box display={"flex"} marginTop="10px">
                    <Typography variant="body1" color="#434A51">
                        {date}
                    </Typography>
                    <Box className={styles.divider} />
                    <Typography variant="body1" color="#434A51">
                        {time}
                    </Typography>
                </Box>
                <Box className={styles.modalContent}>
                    <Typography variant="body1" color="#434A51">
                        {smsContent}
                    </Typography>
                </Box>
                <Box>
                    <Button
                        onClick={linkToContact}
                        variant="contained"
                        color="primary"
                        size="small"
                        endIcon={<ContactLink color="#ffffff" size="md" />}
                    >
                        Link to Contact
                    </Button>
                </Box>
            </Box>
        </CustomModal>
    );
}

UnlinkedTextModal.propTypes = {
    isModalOpen: PropTypes.bool,
    setIsModalOpen: PropTypes.func,
    linkToContact: PropTypes.func,
    smsContent: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
};

export default UnlinkedTextModal;
