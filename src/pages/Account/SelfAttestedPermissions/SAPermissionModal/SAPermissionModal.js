import Modal from "components/Modal";
import Box from "@mui/material/Box";
import { useSAPermissionsContext } from "../SAPermissionProvider";

import styles from "./styles.module.scss";

function SAPermissionModal() {
  const { isModalOpen, setIsModalOpen } = useSAPermissionsContext()

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
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

export default SAPermissionModal;
