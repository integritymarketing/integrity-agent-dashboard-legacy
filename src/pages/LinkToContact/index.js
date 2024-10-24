import * as Sentry from "@sentry/react";
import React, { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import { dateFormatter } from "utils/dateFormatter";

import useCallRecordings from "hooks/useCallRecordings";
import { Download, CallSummary } from "@integritymarketing/icons";

import { CallScriptModal } from "packages/CallScriptModal";
import Tags from "packages/Tags/Tags";

import FinalExpenseContactBar from "components/FinalExpensePlansContainer/FinalExpenseContactBar";
import Footer from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import { useClientServiceContext } from "services/clientServiceProvider";

import ContactSearch from "./ContactSearch";
import PossibleMatches from "./PossibleMatches";
import styles from "./styles.module.scss";
import { Typography, Box, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import OutBoundCall from "components/OutBoundCall";

export default function LinkToContact() {
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const callLogId = queryParams.get("id");
    const callFrom = queryParams.get("phoneNumber");
    const duration = queryParams.get("duration");
    const date = queryParams.get("date");
    const name = queryParams.get("name");
    const callRecordingUrl = queryParams.get("url");
    const smsContent = queryParams.get("smsText");
    const inbound = queryParams.get("inbound");

    const [modalOpen, setModalOpen] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const callRecordings = useCallRecordings();
    const { clientsService } = useClientServiceContext();

    const callsRecordingTags = callRecordings.filter((callRecording) => {
        if (callRecording?.callLogId === parseInt(callLogId)) {
            return callRecording?.callLogTags;
        } else {
            return null;
        }
    });

    const callIsAssigned =
        callRecordings?.length === 0
            ? false
            : !callRecordings.some((callRecording) => callRecording?.callLogId === parseInt(callLogId));

    const getContacts = async (searchStr) => {
        setIsLoading(true);
        try {
            const response = await clientsService.getList(
                null,
                null,
                null,
                searchStr,
                null,
                null,
                null,
                null,
                null,
                null,
                true,
                null,
                null,
                null,
                null,
                null
            );
            setIsLoading(false);
            if (response && response.result) {
                setContacts(response.result);
            }
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            setIsLoading(false);
        }
    };

    const extractAndFlattenTags = (callLogs) => {
        const flattenedTags = callLogs.flatMap((callLog) =>
            callLog.callLogTags.map((tagInfo) => ({
                tagId: tagInfo.tag.tagId,
                tagLabel: tagInfo.tag.tagLabel,
            }))
        );

        // Remove potential duplicates based on tagId
        const uniqueTags = Array.from(new Map(flattenedTags.map((tag) => [tag.tagId, tag])).values());

        return uniqueTags;
    };

    // Extract and flatten tags from the provided data
    const flattenedTags = callsRecordingTags?.length > 0 ? extractAndFlattenTags(callsRecordingTags) : [];

    const tagIds = flattenedTags?.map((tag) => tag.tagId);

    const goToAddNewContactsPage = useCallback(() => {
        const baseRoute = `/contact/add-new/`;
        const logIdParam = callLogId ? `${callLogId}` : "";
        const tagsParam = tagIds ? `tags=${tagIds}` : "";
        const callFromParam = callFrom ? `callFrom=${callFrom}` : "";
        const inboundParam = inbound ? `inbound=${inbound}` : "";
        const nameParam = name ? `name=${name}` : "";
        const queryParams = [tagsParam, callFromParam, inboundParam, nameParam].filter(Boolean).join("&");

        const route = `${baseRoute}${logIdParam}${queryParams ? `?${queryParams}` : ""}`;
        navigate(route);
    }, [callLogId, tagIds, callFrom, navigate]);

    const handleDownloadAndTextClick = () => {
        const recordingUrl = task?.recordingUrl;
        const link = document.createElement("a");
        link.href = recordingUrl;
        link.download = "call_recording.mp3";
        link.click();
    };

    const API_Phone = callFrom?.replace("+1", "");

    return (
        <>
            <Helmet>
                <title>Integrity - Link to Contact</title>
            </Helmet>
            <GlobalNav />
            <FinalExpenseContactBar label="Link to Contact" />
            <div className={styles.outerContainer}>
                <div className={styles.innerContainer}>
                    <Box marginBottom="8px">
                        <Typography variant="h2" color="#052A63">
                            Unlinked {name}
                        </Typography>
                    </Box>
                    <OutBoundCall leadPhone={API_Phone} view="linkToContact" />

                    <Box className={styles.callRecording}>
                        <Typography variant="h4" color="#052A63">
                            {name === "Text" ? "Message Received" : "Call Recorded"}
                        </Typography>
                        <Box display={"flex"} marginTop="10px">
                            <Typography variant="body1" color="#434A51">
                                {dateFormatter(date, "MM/DD/yyyy")}
                            </Typography>
                            <Box className={styles.divider} />
                            <Typography variant="body1" color="#434A51">
                                {dateFormatter(date, "hh:mm A")}
                            </Typography>
                        </Box>
                        {name !== "Text" && (
                            <Box marginTop="16px">
                                <Typography variant="h4" color="#052A63">
                                    Duration
                                </Typography>
                                <Box marginTop="10px" textAlign={"center"}>
                                    <Typography variant="body1" color="#434A51">
                                        {duration}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        {name === "Text" && (
                            <Box className={styles.smsContent}>
                                <Typography variant="body1" color="#434A51">
                                    {smsContent}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Box>
                        {name !== "Text" && (
                            <>
                                <Button
                                    size="medium"
                                    variant="text"
                                    color="primary"
                                    endIcon={<CallSummary color="#4178FF" size="lg" />}
                                    onClick={() => setModalOpen(true)}
                                >
                                    Call Script
                                </Button>
                                {callRecordingUrl && (
                                    <Button
                                        size="medium"
                                        variant="text"
                                        color="primary"
                                        endIcon={<Download color="#4178FF" size="lg" />}
                                        onClick={handleDownloadAndTextClick}
                                    >
                                        Download Call
                                    </Button>
                                )}
                            </>
                        )}
                    </Box>
                    {flattenedTags?.length > 0 ? (
                        <div className={styles.medContent}>
                            <Tags words={flattenedTags} flexDirection={"column"} />
                        </div>
                    ) : null}

                    {callIsAssigned && name !== "Text" ? (
                        <div className={styles.medContent}>
                            <div className={styles.content}>This call is already assigned to a lead.</div>
                        </div>
                    ) : (
                        <Box>
                            <Box>
                                <Typography variant="h4" color="#052a63">
                                    Link to Contact
                                </Typography>
                            </Box>
                            <Box className={styles.linkToContactSection}>
                                <PossibleMatches phone={callFrom} tagIds={tagIds} inbound={inbound} name={name} />
                                <Box className={styles.createNewContact}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={goToAddNewContactsPage}
                                    >
                                        Create New Contact
                                    </Button>
                                </Box>
                                <div className={styles.medContent}>
                                    <ContactSearch
                                        isLoading={isLoading}
                                        onChange={(searchStr) => getContacts(searchStr)}
                                        contacts={contacts}
                                        tagIds={tagIds}
                                        inbound={inbound}
                                        name={name}
                                    />
                                </div>
                            </Box>
                        </Box>
                    )}
                </div>
            </div>
            <CallScriptModal
                modalOpen={modalOpen}
                handleClose={() => {
                    setModalOpen(false);
                }}
            />
            <Footer />
        </>
    );
}
