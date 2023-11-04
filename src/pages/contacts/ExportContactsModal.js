import React, { useState, useRef } from "react";
import * as Sentry from "@sentry/react";
import { CSVLink } from "react-csv";
import styles from "./ContactsPage.module.scss";
import Modal from "components/ui/modal";
import Radio from "components/ui/Radio";
import { Button } from "components/ui/Button";
import clientsService from "services/clientsService";
import useToast from "hooks/useToast";

const headers = [
    { label: "Contact Record Type", key: "contactRecordType" },
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Address", key: "address" },
    { label: "Postal Code", key: "postalCode" },
    { label: "County", key: "county" },
    { label: "Stage", key: "stage" },
    { label: "Client Notes", key: "notes" },
];

const ExportsContactsModal = ({ open, close, contacts, allLeads }) => {
    const showToast = useToast();
    const csvLinkRef = useRef();
    const [selectedOption, setSelectOption] = useState("selectedContacts");
    const [exportData, setExportData] = useState([]);

    const handleExportContactsData = async (event) => {
        event.stopPropagation();
        try {
            let payload =
                selectedOption === "allContacts"
                    ? { exportAll: true, leadIds: allLeads }
                    : { exportAll: false, leadIds: contacts };

            const response = await clientsService.bulkExportContacts(payload);
            const result = await response.json();
            setExportData(result);
            showToast({
                type: "success",
                message: `Download successfully `,
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
            close();
        }
    };

    return (
        <Modal
            open={open}
            size="small"
            labeledById="dialog_export_leads_label"
            descById="dialog_export_leads_desc"
            className={styles.exportContactsModal}
        >
            <CSVLink
                style={{ height: "0" }}
                ref={csvLinkRef}
                data={exportData}
                headers={headers}
                filename="contacts-list.csv"
            />
            <h2 id="dialog_help_label" className="dialog-tile hdg hdg--2 mb-1">
                Export Contacts
            </h2>
            <div className={styles.selectExportContacts}>
                <Radio
                    id="selectedContacts"
                    htmlFor="selectedContacts"
                    label={`Selected contacts (${contacts?.length})`}
                    name="export-contacts"
                    value="selectedContacts"
                    checked={selectedOption === "selectedContacts"}
                    onChange={(event) => setSelectOption(event.currentTarget.value)}
                />
                <Radio
                    id="allContacts"
                    htmlFor="allContacts"
                    label="All contacts"
                    name="export-contacts"
                    value="allContacts"
                    checked={selectedOption === "allContacts"}
                    onChange={(event) => setSelectOption(event.currentTarget.value)}
                />
            </div>
            <div className={styles.exportContactFooterButtons}>
                <Button type="secondary" label="Cancel" onClick={close} />
                <Button label="Export" onClick={handleExportContactsData} />
            </div>
        </Modal>
    );
};

export default ExportsContactsModal;
