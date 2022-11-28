import React, { useState } from "react";
import "./index.scss";
import Logo from "./image.svg";
import AgentContactInfo from "partials/agent-contact-info";

export default ({ agentInfo }) => {
  const [helpModal, setHelpModal] = useState(false);

  const handleCloseHelpModal = () => {
    setHelpModal(false);
  };

  return (
    <header className="header-unauthenticated">
      <AgentContactInfo
        open={helpModal}
        close={handleCloseHelpModal}
        agentInfo={agentInfo}
      />
      <img className="logo" src={Logo} alt="Medicare Center" />
      <div className="need-help" onClick={() => setHelpModal(true)}>
        Need Help?
      </div>
    </header>
  );
};