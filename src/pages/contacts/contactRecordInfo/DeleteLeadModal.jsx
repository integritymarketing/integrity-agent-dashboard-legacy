import React, { useContext } from "react";
import Modal from "components/ui/modal";
import { useClientServiceContext } from "services/clientServiceProvider";
import DeleteLeadContext from "contexts/deleteLead";
import { useNavigate } from "react-router-dom";

const DeleteLeadModal = ({ leadsId, leadName, setDeleteModalStatus, deleteModalStatus }) => {
    const { setDeleteLeadId, setLeadName } = useContext(DeleteLeadContext);
    const navigate = useNavigate();
    const { clientsService } = useClientServiceContext();

    const deleteLead = async () => {
        await clientsService.deleteClient(leadsId);
        setDeleteLeadId(leadsId);
        setLeadName(leadName);
        navigate("/contacts");
    };

    return (
        <div className="customform">
            <Modal open={deleteModalStatus} labeledById="dialog_contact_label">
                <div className="customDeletepopup">
                    <h3>Delete Contact</h3>
                    <p>Are you sure you want to delete this contact? </p>
                    <div className="customDeletepopupbtn">
                        <button className="cancelbtn" onClick={setDeleteModalStatus}>
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

export default DeleteLeadModal;
