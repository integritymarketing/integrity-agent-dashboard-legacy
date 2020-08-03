import React, { useState } from "react";
import Modal from "components/ui/modal";
import ContactInfo from "partials/contact-info";

export default ({ ...props }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // TODO: call API to resend email
  if (!emailSent) {
    return (
      <div className="text-center text-body">
        Didn’t receive an email?{" "}
        <button
          type="button"
          className="link"
          onClick={() => setEmailSent(true)}
        >
          Resend now
        </button>
      </div>
    );
  }
  return (
    <React.Fragment>
      <div className="text-center text-body">
        We have resent the email. <br />
        If the problem persists,{" "}
        <button
          type="button"
          className="link"
          onClick={() => setModalOpen(true)}
        >
          please contact support
        </button>
        .
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ContactInfo />
      </Modal>
    </React.Fragment>
  );
};
