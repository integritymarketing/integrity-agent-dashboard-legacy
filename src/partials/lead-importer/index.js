import { useEffect, useRef, useState } from "react";
import { Importer, ImporterField } from "react-csv-importer";
import { useNavigate } from "react-router-dom";

import LeadImporterStatusContainer from "partials/lead-importer/status-container";

import { useClientServiceContext } from "services/clientServiceProvider";

import { getResourceUrl } from "pages/ResourcesPage";

import { getFormattedData } from "./helper";
import "./index.scss";

const LeadImporter = () => {
    const scrollToRef = useRef();
    const { clientsService } = useClientServiceContext();
    const navigate = useNavigate();
    const [importErrors, setImportErrors] = useState([]);
    const [importSuccesses, setImportSuccesses] = useState(0);

    const handleImportError = (error) => {
        const newErrors = typeof error === "string" ? [{ Key: error, Value: "Error" }] : [...error];
        setImportErrors((prev) => [...prev, ...newErrors]);
    };

    const templateUrl = getResourceUrl("Integrity-Client-Import.csv");

    function checkPhoneOrEmailPresent(arr) {
        return arr.every((item) => item.phone || item.email);
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList" || mutation.type === "subtree") {
                checkAndModifyElements();
            }
        }
    });

    function checkAndModifyElements() {
        const v = document.querySelectorAll(".CSVImporter_ColumnDragTargetArea__boxLabel");
        v.forEach((element) => {
            if (element.innerText === "Email" || element.innerText === "Phone") {
                const type = element.innerText;
                element.innerHTML = `${type} <span class="tooltip">*</span>`;
            }
        });
    }

    useEffect(() => {
        observer.observe(document.getElementsByClassName("CSVImporter_Importer")[0], {
            childList: true,
            subtree: true,
        });
    }, []);

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
                    chunkSize={10000} // optional, internal parsing chunk size in bytes
                    assumeNoHeaders={false} // optional, keeps "data has headers" checkbox off by default
                    restartable={false} // optional, lets user choose to upload another file when import is complete
                    onStart={() => {
                        // optional, invoked when user has mapped columns and started import
                        // not much available in this method.. metadata basics like filename available.
                        // see example: https://github.com/beamworks/react-csv-importer/blob/7aaa26962c3cd1a3bb1ea2ccef4f18ee2495fa87/demo-app/src/pages/ImportPage.tsx#L38
                    }}
                    processChunk={async (rows) => {
                        // required, receives a list of parsed objects based on defined fields and user column mapping;
                        // may be called several times if file is large
                        rows = rows.filter((item) => {
                            return Object.values(item).some((value) => value !== "" && value !== null);
                        });
                        const isValid = checkPhoneOrEmailPresent(rows);
                        if (isValid) {
                            const formattedData = rows.map((row) => getFormattedData(row));
                            try {
                                const response = await clientsService.bulkCreateClients(formattedData);
                                const data = await response.json();

                                if (response.status >= 200 && response.status < 300) {
                                    setImportSuccesses((prevState) => prevState + data.successfulUploadCount);
                                    handleImportError(data.uploadErrorResponse);
                                } else {
                                    handleImportError((data || {}).uploadErrorResponse || data);
                                }
                            } catch (e) {
                                // eslint-disable-next-line no-console
                                console.log({ e });
                                handleImportError(`An internal error has occurred.`);
                            }
                        } else {
                            handleImportError("Either Phone or Email is required for all records.");
                        }
                    }}
                    onComplete={() => {
                        ((scrollToRef || {}).current || {}).scrollIntoView();
                        // optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
                        // maybe show import issues in summary modal?
                    }}
                    onClose={() => {
                        navigate("/contacts");
                    }}
                >
                    <ImporterField name="firstName" label="First Name (required)" />
                    <ImporterField name="lastName" label="Last Name (required)" />
                    <ImporterField name="email" label="Email (required)" optional />
                    <ImporterField name="phone" label="Phone (required, 10 digits)" optional />
                    <ImporterField name="address1" label="Address1 (optional)" optional />
                    <ImporterField name="address2" label="Address2 (optional)" optional />
                    <ImporterField name="city" label="City (optional)" optional />
                    <ImporterField name="state" label="Abbreviated State (optional)" optional />
                    <ImporterField name="postalCode" label="5 Digit Zip Code (optional)" optional />
                    <ImporterField name="birthdate" label="Birthdate (optional, MM/DD/YYYY)" optional />
                    <ImporterField name="medicareBeneficiaryID" label="Medicare Beneficiary Id (optional)" optional />
                    <ImporterField name="partA" label="Part A Effective Date (optional, MM/DD/YYYY)" optional />
                    <ImporterField name="partB" label="Part B Effective Date (optional, MM/DD/YYYY)" optional />
                    <ImporterField name="height" label="Height (optional, inches)" optional />
                    <ImporterField name="weight" label="Weight (optional, pounds)" optional />
                    <ImporterField name="gender" label="Gender (optional, Male/Female)" optional />
                    <ImporterField name="isTobaccoUser" label="Tobacco Use (optional, Yes or No)" optional />
                    <ImporterField name="stage" label="Stage (optional)" optional />
                    <ImporterField name="notes" label="Notes (optional)" optional />
                </Importer>
            </div>
        </div>
    );
};

export default LeadImporter;
