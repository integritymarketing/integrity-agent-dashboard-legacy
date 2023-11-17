import Box from "@mui/material/Box";

import DeleteIcon from "components/icons/version-2/Delete";

import DeleteContactsModal from "pages/ContactsList/ContactListModal/DeleteContactsModal";
import { useContactsListModalContext } from "pages/ContactsList/providers/ContactsListModalProvider";
import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import styles from "./styles.module.scss";

function Delete() {
    const { selectedContacts } = useContactsListContext();
    const { setIsDeleteModalOpen } = useContactsListModalContext();
    const hasSelectedContacts = selectedContacts.length > 0;

    if (!hasSelectedContacts) {
        return <></>;
    }

    return (
        <>
            <Box className={styles.deleteIcon} onClick={() => setIsDeleteModalOpen(true)}>
                <DeleteIcon />
            </Box>
            <DeleteContactsModal />
        </>
    );
}

export default Delete;
