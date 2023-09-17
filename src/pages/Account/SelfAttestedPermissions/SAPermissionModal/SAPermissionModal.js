import PropTypes from "prop-types";
import Modal from "components/Modal";
import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";

const useStyles = makeStyles(() => ({
  modalContentHeader: {
    color: "#052A63",
    marginTop: "24px",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "24px",
  },
}));

function SAPermissionModal({ isModalOpen, onClose }) {
  const styles = useStyles();

  return (
    <Modal
      open={isModalOpen}
      onClose={onClose}
      title="Self-Attested Permissions"
      hideFooter={true}
      size="wide"
    >
      <Box className={styles.modalContentHeader}>Pharetra Tortor Magna</Box>
      <Box className={styles.modalContent}>
        Cras mattis consectetur purus sit amet fermentum. Praesent commodo
        cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
        lacus vel augue laoreet rutrum faucibus dolor auctor. Cras mattis
        consectetur purus sit amet fermentum. Donec id elit non mi porta gravida
        at eget metus. Vestibulum id ligula porta felis euismod semper.
        Curabitur blandit tempus porttitor.
      </Box>
    </Modal>
  );
}

SAPermissionModal.propTypes = {
  isModalOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default SAPermissionModal;
