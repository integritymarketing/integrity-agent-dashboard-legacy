import React, { useState } from "react";

import PropTypes from "prop-types";

import AgentContactInfo from "partials/agent-contact-info";

import Logo from "./image.svg";
import "./index.scss";

const BlueHeader = ({ agentInfo }) => {
    const [helpModal, setHelpModal] = useState(false);

    const handleCloseHelpModal = () => {
        setHelpModal(false);
    };

    return (
        <header className="header-unauthenticated">
            <AgentContactInfo open={helpModal} close={handleCloseHelpModal} agentInfo={agentInfo} />
            <img className="logo" src={Logo} alt="Integrity" />
            <div className="need-help" onClick={() => setHelpModal(true)}>
                Need Help?
            </div>
        </header>
    );
};

BlueHeader.propTypes = {
    agentInfo: PropTypes.object.isRequired,
};

export default BlueHeader;
