import React from "react";
import Modal from "components/Modal";
import NewScopeOfAppointment from "../newScopeOfAppointment";

function SOAModal({ id, openSOAModal, setOpenSOAModal, refreshSOAList }) {
  return (
    <Modal
      open={openSOAModal}
      onClose={() => {
        setOpenSOAModal(false);
      }}
      hideFooter
      contentStyle={{ padding: "0" }}
      title={"Send Scope Of Appointment"}
    >
      <NewScopeOfAppointment
        leadId={id}
        onCloseModal={() => {
          setOpenSOAModal(false);
        }}
        refreshSOAList={refreshSOAList}
      />
    </Modal>
  );
}

export default SOAModal;
