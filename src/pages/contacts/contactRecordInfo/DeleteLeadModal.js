import React, { useContext, useState } from "react";
import Modal from "components/ui/modal";
import clientsService from "services/clientsService";
import DeleteLeadContext from "contexts/deleteLead";
import { useHistory } from "react-router-dom";

export default ({ leadsId, leadName, ...props }) => {
  const { setDeleteLeadId, setLeadName } = useContext(DeleteLeadContext);
  const history = useHistory();
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);

  const deleteLead = async () => {
    await clientsService.deleteClient(leadsId);
    setDeleteLeadId(leadsId);
    setLeadName(leadName);
    history.push("/contacts");
  };

  return (
    <div className="customform">
      <div className="deletecontactsection">
        <button className="del-btn" onClick={() => setDeleteModalStatus(true)}>
          Delete Contact
        </button>
      </div>
      <Modal open={deleteModalStatus} labeledById="dialog_contact_label">
        <div className="customDeletepopup">
          <h3>Delete Contact</h3>
          <p>Are you sure you want to delete this contact? </p>
          <div className="customDeletepopupbtn">
            <button
              className="cancelbtn"
              onClick={() => setDeleteModalStatus(false)}
            >
              cancel
            </button>
            <button className="deletebtn" onClick={deleteLead}>
              delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
