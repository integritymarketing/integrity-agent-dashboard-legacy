import React from "react";
import styles from "./ContactsPage.module.scss";
import Modal from "components/ui/modal";
import { Button } from "components/ui/Button";

export default ({ open, close, count, onConfirm }) => {
  const isContacts = count > 1;
  return (
    <Modal
      open={open}
      size="small"
      labeledById="dialog_delete_leads_label"
      descById="dialog_delete_leads_desc"
      className={styles.deleteContactsModal}
    >
      <h2 id="dialog_help_label" className="dialog-tile hdg hdg--2 mb-1">
        Delete Contacts
      </h2>
      <p id="dialog_help_desc" className="text-body mb-4">
        Are you sure you want to delete <strong>{count}</strong> selected
        contact{isContacts ? "s" : ""}?
      </p>
      <div className={styles.deleteContactFooterButtons}>
        <Button type="secondary" label="Cancel" onClick={close} />
        <Button label="Delete" onClick={onConfirm} />
      </div>
    </Modal>
  );
};
