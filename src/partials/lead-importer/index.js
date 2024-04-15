import { useRef, useState } from "react";
import { Importer, ImporterField } from "react-csv-importer";
import { useNavigate } from "react-router-dom";

import LeadImporterStatusContainer from "partials/lead-importer/status-container";

import clientsService from "services/clientsService";

import { getResourceUrl } from "pages/ResourcesPage";

import { getFormattedData } from "./helper";
import "./index.scss";

const LeadImporter = () => {
    const scrollToRef = useRef();
    const navigate = useNavigate();
    const [importErrors, setImportErrors] = useState([]);
    const [importSuccesses, setImportSuccesses] = useState(0);

    const handleImportError = (error) => {
        const newErrors = typeof error === "string" ? [{ Key: error, Value: "Error" }] : [...error];
        setImportErrors((prev) => [...prev, ...newErrors]);
    };

    const templateUrl = getResourceUrl("Integrity-Client-Import.csv");

    return (
        <div ref={scrollToRef}>
            <LeadImporterStatusContainer errors={importErrors} successes={importSuccesses} />

            <div className="card">
                <h3 className="hdg hdg--3 mb-3">
                    Import Leads By CSV File Upload{" "}
                    <a href={templateUrl} download={templateUrl} className={`btn ml-2`}>
                        Download Template
                    </a>
                </h3>
                <Importer
                    chunkSize={10000}
                    assumeNoHeaders={false}
                    restartable={false}
                    processChunk={async (rows, { startIndex }) => {
                        const errors = [];
                        const validRows = rows.filter((row, index) => {
                            if (!row.email && !row.phone) {
                                errors.push({Key: `Row ${startIndex + index + 1}`, Value: "Missing both email and phone"});
                                return false;
                            }
                            return true;
                        });

                        if (errors.length) {
                            setImportErrors((prevErrors) => [...prevErrors, ...errors]);
                            return; // Skip processing this chunk due to validation errors
                        }

                        const formattedData = validRows.map(row => getFormattedData(row));
                        try {
                            const response = await clientsService.bulkCreateClients(formattedData);
                            const data = await response.json();

                            if (response.status >= 200 && response.status < 300) {
                                setImportSuccesses((prev) => prev + data.successfulUploadCount);
                                if (data.uploadErrorResponse) {
                                    handleImportError(data.uploadErrorResponse);
                                }
                            } else {
                                handleImportError({ Key: "HTTP Error", Value: response.statusText || "Unknown Error" });
                            }
                        } catch (e) {
                            console.error(e);
                            handleImportError({ Key: "Internal Error", Value: "An error occurred during processing." });
                        }
                    }}
                    onComplete={() => {
                        scrollToRef.current?.scrollIntoView();
                    }}
                    onClose={() => navigate("/contacts")}
                >
                    <ImporterField name="contactRecordType" label="Contact Record Type" optional />
                    <ImporterField name="firstName" label="First Name" optional />
                    <ImporterField name="lastName" label="Last Name" optional />
                    <ImporterField name="email" label="Email" />
                    <ImporterField name="phone" label="Phone" />
                    <ImporterField name="address1" label="Address 1" optional />
                    <ImporterField name="address2" label="Address 2" optional />
                    <ImporterField name="city" label="City" optional />
                    <ImporterField name="state" label="State" optional />
                    <ImporterField name="postalCode" label="Postal Code" optional />
                    <ImporterField name="birthdate" label="Birthdate" optional />
                    <ImporterField name="medicareBeneficiaryID" label="Medicare Beneficiary Id" optional />
                    <ImporterField name="partA" label="Part A Effective Date" optional />
                    <ImporterField name="partB" label="Part B Effective Date" optional />
                    <ImporterField name="height" label="Height" optional />
                    <ImporterField name="weight" label="Weight" optional />
                    <ImporterField name="gender" label="Gender" optional />
                    <ImporterField name="isTobaccoUser" label="Tabacco Use" optional />
                    <ImporterField name="stage" label="Stage" optional />
                    <ImporterField name="notes" label="Notes" optional />
                </Importer>
            </div>
        </div>
    );
};

export default LeadImporter;
