import React from "react";
import styles from "./ContactsPage.module.scss";
import Modal from "components/ui/modal";
import { Button } from "components/ui/Button";

export default ({ open, close, errors }) => {
  return (
    <Modal
      open={open}
      size="small"
      labeledById="dialog_delete_leads_label"
      descById="dialog_delete_leads_desc"
      className={styles.deleteContactsModal}
    >
      <h2 id="dialog_help_label" className="dialog-tile hdg hdg--2 mb-1">
        Bulk Edit Contacts Errors
      </h2>
      <p id="dialog_help_desc" className="text-body mb-4">
       
      </p>
      <div className={styles.deleteContactFooterButtons}>
        <Button type="secondary" label="Cancel" onClick={close} />
      </div>
    </Modal>
  );
};
