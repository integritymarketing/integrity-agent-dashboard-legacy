import * as Sentry from "@sentry/react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import { debounce } from "lodash";
import PropTypes from "prop-types";

import { dateFormatter } from "utils/dateFormatter";
import useCallRecordings from "hooks/useCallRecordings";
import { Download } from "@integritymarketing/icons";

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
import OutBoundCall from "components/OutBoundCall";

export default function LinkToContact() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const callLogId = queryParams.get("id");
    const phoneNumber = decodeURIComponent(queryParams.get("phoneNumber"));
    const callDuration = queryParams.get("duration");
    const callDate = queryParams.get("date");
    const callerName = queryParams.get("name");
    const callRecordingUrl = queryParams.get("url");
    const smsContent = queryParams.get("smsText");

    const [modalOpen, setModalOpen] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const callRecordings = useCallRecordings();
    const { clientsService } = useClientServiceContext();

    const callsRecordingTags = useMemo(() => {
        return callRecordings.filter((callRecording) => {
            if (callRecording?.callLogId === parseInt(callLogId)) {
                return callRecording?.callLogTags;
            } else {
                return null;
            }
        });
    }, [callRecordings, callLogId]);

    const callIsAssigned =
        callRecordings?.length === 0
            ? false
            : !callRecordings.some((callRecording) => callRecording?.callLogId === parseInt(callLogId));

    const callRecordItem = callRecordings?.filter((callRecording) => callRecording?.callLogId === parseInt(callLogId));
    const callType = callRecordItem?.[0]?.callType ? callRecordItem?.[0]?.callType : "inbound";
    const isInboundCall = callType === "inbound";

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
            if (response && response.result) {
                setContacts(response.result);
            }
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedContactSearch = useCallback(
        debounce((query) => {
            getContacts(query);
        }, 1000),
        [getContacts]
    );

    useEffect(() => {
        return () => {
            debouncedContactSearch.cancel();
        };
    }, [debouncedContactSearch]);

    const extractAndFlattenTags = (callLogs) => {
        const flattenedTags = callLogs.flatMap((callLog) =>
            callLog.callLogTags.map((tagInfo) => ({
                tagId: tagInfo.tag.tagId,
                tagLabel: tagInfo.tag.tagLabel,
            }))
        );

        const uniqueTags = Array.from(new Map(flattenedTags.map((tag) => [tag.tagId, tag])).values());

        return uniqueTags;
    };

    const flattenedTags = callsRecordingTags?.length > 0 ? extractAndFlattenTags(callsRecordingTags) : [];

    const tagIds = flattenedTags?.map((tag) => tag.tagId);

    const goToAddNewContactsPage = useCallback(() => {
        const baseRoute = `/contact/add-new/`;
        const logIdParam = callLogId ? `${callLogId}` : "";
        const tagsParam = tagIds ? `tags=${tagIds}` : "";
        const callFromParam = phoneNumber ? `callFrom=${phoneNumber}` : "";
        const inboundParam = isInboundCall ? `inbound=${isInboundCall}` : "";
        const nameParam = callerName ? `name=${callerName}` : "";
        const newQueryParams = [tagsParam, callFromParam, inboundParam, nameParam].filter(Boolean).join("&");
        const route = `${baseRoute}${logIdParam}${newQueryParams ? `?${newQueryParams}` : ""}`;
        navigate(route);
    }, [callLogId, tagIds, phoneNumber, isInboundCall, callerName, navigate]);

    const handleDownloadAndTextClick = () => {
        if (!callRecordingUrl) {return;}

        const link = document.createElement("a");
        link.href = callRecordingUrl;
        link.download = "call_recording.mp3";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formattedPhoneNumber = phoneNumber?.replace("+1", "");

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
                            Unlinked {callerName}
                        </Typography>
                    </Box>
                    <OutBoundCall leadPhone={formattedPhoneNumber} view="linkToContact" />
                    <Box className={styles.callRecording}>
                        <Typography variant="h4" color="#052A63">
                            {callerName === "Text" ? "Message Received" : "Call Recorded"}
                        </Typography>
                        <Box display={"flex"} marginTop="10px">
                            <Typography variant="body1" color="#434A51">
                                {dateFormatter(callDate, "MM/DD/yyyy")}
                            </Typography>
                            <Box className={styles.divider} />
                            <Typography variant="body1" color="#434A51">
                                {dateFormatter(callDate, "hh:mm A")}
                            </Typography>
                        </Box>
                        {callerName !== "Text" && (
                            <Box marginTop="16px">
                                <Typography variant="h4" color="#052A63">
                                    Duration
                                </Typography>
                                <Box marginTop="10px" textAlign={"center"}>
                                    <Typography variant="body1" color="#434A51">
                                        {callDuration}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        {callerName === "Text" && (
                            <Box className={styles.smsContent}>
                                <Typography variant="body1" color="#434A51">
                                    {smsContent}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Box>
                        {callerName !== "Text" && callRecordingUrl && (
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
                    </Box>
                    {flattenedTags?.length > 0 ? (
                        <div className={styles.medContent}>
                            <Tags words={flattenedTags} flexDirection={"column"} />
                        </div>
                    ) : null}

                    {callIsAssigned && callerName !== "Text" ? (
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
                                <PossibleMatches phone={phoneNumber} tagIds={tagIds} inbound={isInboundCall} name={callerName} />
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
                                        onChange={(searchStr) => debouncedContactSearch(searchStr)}
                                        contacts={contacts}
                                        tagIds={tagIds}
                                        inbound={isInboundCall}
                                        name={callerName}
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

LinkToContact.propTypes = {
    callLogId: PropTypes.string,
    phoneNumber: PropTypes.string,
    callDuration: PropTypes.string,
    callDate: PropTypes.string,
    callerName: PropTypes.string,
    callRecordingUrl: PropTypes.string,
    smsContent: PropTypes.string,
};