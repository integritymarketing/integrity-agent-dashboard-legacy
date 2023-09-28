import { useSAPModalsContext } from "../providers/SAPModalProvider";
import SAPermissionModal from "./SAPermissionModal";

function SAExpiredModal() {
  const { isExpriedModalOpen, setIsExpriedModalOpen } = useSAPModalsContext();

  return (
    <SAPermissionModal
      isModalOpen={isExpriedModalOpen}
      setIsModalOpen={setIsExpriedModalOpen}
      title="Self-Attestation Expired"
      subTitle="Permission Removed"
      content={
        <>
          This self-attested permission was not verified by the carrier after 5
          days and has been removed.
        </>
      }
    />
  );
}

export default SAExpiredModal;
