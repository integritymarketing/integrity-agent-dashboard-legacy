import React from "react";
import Modal from "components/ui/modal";
import { Button } from "components/ui/Button";
import "./index.scss";

export default ({ isOpen, onClose }) => {
  return (
    <div className="authorized-help-modal">
      <Modal
        open={isOpen}
        onClose={onClose}
        labeledById="authorized-representative-help"
      >
        <p id="authorized-representative-help" className="text-body mb-2">
          By law, Medicare must have written permission from the primary
          Medicare beneficiary (an “authorization”) to use or give out personal
          medical information for any purpose that isn't set out in the privacy
          notice contained in the Medicare & You handbook. The primary Medicare
          beneficiary may take back (“revoke”) their written permission at any
          time, except if Medicare has already acted based on your permission.
          For more details, please visit{" "}
          <a
            class="blue-link"
            href="https://www.medicare.gov/"
            target="_blank"
            rel="noopener noreferrer" 
          >
            medicare.gov
          </a>
        </p>
        <div className="cancel-button">
          <Button label="Close" onClick={onClose} />
        </div>
      </Modal>
    </div>
  );
};
