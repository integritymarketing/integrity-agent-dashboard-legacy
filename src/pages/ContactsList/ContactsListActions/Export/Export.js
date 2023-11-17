import Box from "@mui/material/Box";

import ExportIcon from "components/icons/version-2/Export";

import ExportsContactsModal from "pages/ContactsList/ContactListModal/ExportContactsModal";
import { useContactsListModalContext } from "pages/ContactsList/providers/ContactsListModalProvider";
import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import styles from "./styles.module.scss";

function Export() {
    const { selectedContacts } = useContactsListContext();
    const { setIsExportModalOpen } = useContactsListModalContext();
    const hasSelectedContacts = selectedContacts.length > 0;

    if (!hasSelectedContacts) {
        return <></>;
    }

    return (
        <>
            <Box className={styles.exportIcon} onClick={() => setIsExportModalOpen(true)}>
                <ExportIcon />
            </Box>
            <ExportsContactsModal />
        </>
    );
}

export default Export;
