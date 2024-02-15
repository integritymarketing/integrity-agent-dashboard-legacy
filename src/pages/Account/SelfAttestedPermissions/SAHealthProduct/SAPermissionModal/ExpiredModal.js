import { useSAPModalsContext } from "../providers/SAPModalProvider";
import SAPermissionModal from "./SAPermissionModal";

const EXPIRED_CONTENT = `This self-attested permission was not verified by the carrier after 5
days and has been removed.`;

function SAExpiredModal({ content = EXPIRED_CONTENT }) {
  const { isExpriedModalOpen, setIsExpriedModalOpen } = useSAPModalsContext();

  return (
    <SAPermissionModal
      isModalOpen={isExpriedModalOpen}
      setIsModalOpen={setIsExpriedModalOpen}
      title="Self-Attestation Expired"
      subTitle="Permission Removed"
      content={
        <>
          {content}
        </>
      }
    />
  );
}

export default SAExpiredModal;