import React, { useState } from "react";
import Modal from "components/ui/modal";
import ContactInfo from "partials/contact-info";
import useParams from "hooks/useParams";

export default ({ resendFn, btnClass = "" }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const params = useParams();

  if (emailError) {
    return (
      <React.Fragment>
        <div className="mt-2 text-body">
          Sorry, there was a problem resending the email.
          <br />
          If the problem persists,{" "}
          <button
            type="button"
            className="link link--invert link--force-underline"
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
  }
  if (!emailSent) {
    return (
      <div className="mt-2 text-body">
        Didn’t receive an email?{" "}
        <button
          type="button"
          className={`link link--invert link--force-underline ${btnClass}`}
          onClick={async () => {
            let response = await resendFn(params.get("npn"));
            if (response.status >= 200 && response.status < 300) {
              setEmailSent(true);
            } else {
              setEmailError(true);
            }
          }}
        >
          Resend now
        </button>
      </div>
    );
  }
  return (
    <React.Fragment>
      <div className="mt-2 text-body">
        We have resent the email. <br />
        If the problem persists,{" "}
        <button
          type="button"
          className="link link--invert link--force-underline"
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
