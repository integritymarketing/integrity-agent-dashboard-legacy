import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import useToast from "hooks/useToast";

import { Button } from "components/ui/Button";
import Modal from "components/ui/modal";

import { useClientServiceContext } from "services/clientServiceProvider";

import styles from "./styles.module.scss";

import { useContactsListModalContext } from "../providers/ContactsListModalProvider";
import { useContactsListContext } from "../providers/ContactsListProvider";

const DeleteContactsModal = () => {
    const { isDeleteModalOpen, setIsDeleteModalOpen } = useContactsListModalContext();
    const { selectedContacts, refreshData } = useContactsListContext();
    const showToast = useToast();
    const { clientsService } = useClientServiceContext();

    const numberOfSelectedContacts = selectedContacts.length;
    const hasMoreThanOne = numberOfSelectedContacts > 1;

    const undoDelete = async () => {
        const response = await clientsService.reActivateClients(selectedContacts);
        if (response.ok) {
            refreshData();
            showToast({
                type: "success",
                message: `contacts reactivated successfully`,
            });
        } else if (response.status === 400) {
            showToast({
                type: "error",
                message: "Error while reactivating contacts",
            });
        }
    };

    const handleDeleteContacts = async () => {
        await clientsService.deleteContactLeads(selectedContacts);
        refreshData();
        showToast({
            type: "success",
            message: `${selectedContacts.length} contacts deleted`,
            time: 10000,
            link: "UNDO",
            onClickHandler: undoDelete,
            closeToastRequired: true,
        });
        setIsDeleteModalOpen(false);
    };

    return (
        <Modal open={isDeleteModalOpen} size="small" className={styles.deleteContactsModal}>
            <Typography variant="h4">Delete Contacts</Typography>
            <Box className={styles.text}>
                Are you sure you want to delete <strong>{numberOfSelectedContacts}</strong> selected contact
                {hasMoreThanOne ? "s" : ""}?
            </Box>
            <Box className={styles.footerButtons}>
                <Button type="secondary" label="Cancel" onClick={() => setIsDeleteModalOpen(false)} />
                <Button label="Delete" onClick={handleDeleteContacts} />
            </Box>
        </Modal>
    );
};

export default DeleteContactsModal;
