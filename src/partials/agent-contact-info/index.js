import React from "react";
import Modal from "components/ui/modal";
import "./index.scss";

export default ({ open, close, agentInfo }) => {
  const { AgentFirstName, AgentLastName, AgentEmail } = agentInfo;
  return (
    <Modal
      open={open}
      onClose={close}
      labeledById="dialog_help_label"
      descById="dialog_help_desc"
    >
      <h2 id="dialog_help_label" className="dialog-tile hdg hdg--2 mb-1">
        Need Help? &nbsp;Get in touch
      </h2>
      <p id="dialog_help_desc" className="text-body mb-4">
        I'm happy to answer any questions. Use my contact information below and
        i'll respond ASAP.
      </p>
      <div className="agent-details">
        <div className="agent-name hdg--2 pb-1">
          {AgentFirstName} {AgentLastName}
        </div>
        <span className="hdg hdg--4 pb-1">Phone Number: &nbsp;</span>
        <span className="text-body pb-1">
          <a href="tel:+1-888-818-3760" className="link">
            888-818-3760
          </a>
        </span>
        <div>
          <div>
            <span className="hdg hdg--4 pb-4">Email: &nbsp;</span>
            <span className="text-body pb-4">
              <a href={`mailto:${AgentEmail}`} className="link">
                {AgentEmail}
              </a>
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
