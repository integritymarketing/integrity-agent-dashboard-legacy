import Box from "@mui/material/Box";

import { useSAPModalsContext } from "../providers/SAPModalProvider";
import SAPermissionModal from "./SAPermissionModal";

import styles from "./styles.module.scss";

const EMAIL = "support@clients.integrity.com";

function ErrorModal() {
  const { isErrorModalOpen, setIsErrorModalOpen } = useSAPModalsContext();

  return (
    <SAPermissionModal
      isModalOpen={isErrorModalOpen}
      setIsModalOpen={setIsErrorModalOpen}
      title="Self-Attested Error"
      subTitle=""
      actionButtonName="Ok"
      hideFooter={false}
      onSave={() => setIsErrorModalOpen(false)}
      content={
        <>
          <Box>
            An error has occurred. Please try again later. If the issue
            persists, please contact
            <a href={`mailto:${EMAIL}`} className={styles.link}>
              {EMAIL}.
            </a>
          </Box>
        </>
      }
    />
  );
}

export default ErrorModal;
