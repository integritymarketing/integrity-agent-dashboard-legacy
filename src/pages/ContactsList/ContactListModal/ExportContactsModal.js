import * as Sentry from "@sentry/react";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import useToast from "hooks/useToast";

import { Button } from "components/ui/Button";
import Radio from "components/ui/Radio";
import Modal from "components/ui/modal";

import { useClientServiceContext } from "services/clientServiceProvider";

import styles from "./styles.module.scss";

import { useContactsListModalContext } from "../providers/ContactsListModalProvider";
import { useContactsListContext } from "../providers/ContactsListProvider";

const csvHeaders = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Address", key: "address" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Postal Code", key: "postalCode" },
    { label: "County", key: "county" },
    { label: "Stage", key: "stage" },
    { label: "Client Notes", key: "notes" },
];

const ExportContactsModal = () => {
    const showToast = useToast();
    const csvLinkRef = useRef();
    const [selectedOption, setSelectedOption] = useState("selectedContacts");
    const [exportData, setExportData] = useState([]);
    const { isExportModalOpen, setIsExportModalOpen } = useContactsListModalContext();
    const { selectedContacts, allLeads } = useContactsListContext();
    const { clientsService } = useClientServiceContext();

    const handleExportContactsData = async (event) => {
        event.stopPropagation();
        try {
            const payload =
                selectedOption === "allContacts"
                    ? { exportAll: true, leadIds: allLeads }
                    : { exportAll: false, leadIds: selectedContacts };

            const response = await clientsService.bulkExportContacts(payload);
            const result = await response.json();
            setExportData(result);
            showToast({
                type: "success",
                message: "Download successfully",
            });
            setTimeout(() => {
                if (result.length && csvLinkRef?.current?.link) {
                    csvLinkRef.current.link.click();
                    setExportData([]);
                }
            });
        } catch (error) {
            Sentry.captureException(error);
            showToast({
                type: "error",
                message: "Failed to download",
            });
        } finally {
            setIsExportModalOpen(false);
        }
    };

    return (
        <Modal open={isExportModalOpen} size="small" className={styles.exportContactsModal}>
            <CSVLink
                style={{ height: "0" }}
                ref={csvLinkRef}
                data={exportData}
                headers={csvHeaders}
                filename="contacts-list.csv"
            />
            <Typography variant="h4">Export Contacts</Typography>
            <Box className={styles.selectExportContacts}>
                <Radio
                    id="selectedContacts"
                    htmlFor="selectedContacts"
                    label={`Selected contacts (${selectedContacts?.length})`}
                    name="export-contacts"
                    value="selectedContacts"
                    checked={selectedOption === "selectedContacts"}
                    onChange={(event) => setSelectedOption(event.currentTarget.value)}
                />
                <Radio
                    id="allContacts"
                    htmlFor="allContacts"
                    label="All contacts"
                    name="export-contacts"
                    value="allContacts"
                    checked={selectedOption === "allContacts"}
                    onChange={(event) => setSelectedOption(event.currentTarget.value)}
                />
            </Box>
            <Box className={styles.footerButtons}>
                <Button type="secondary" label="Cancel" onClick={() => setIsExportModalOpen(false)} />
                <Button label="Export" onClick={handleExportContactsData} />
            </Box>
        </Modal>
    );
};

export default ExportContactsModal;
