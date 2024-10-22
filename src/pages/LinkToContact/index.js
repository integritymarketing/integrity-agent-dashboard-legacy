import * as Sentry from "@sentry/react";
import React, { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";

import { dateFormatter } from "utils/dateFormatter";
import { formatPhoneNumber } from "utils/phones";

import useCallRecordings from "hooks/useCallRecordings";

import { Button } from "packages/Button";
import { CallScriptModal } from "packages/CallScriptModal";
import Heading2 from "packages/Heading2";
import Heading3 from "packages/Heading3";
import Tags from "packages/Tags/Tags";

import Footer from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import { useClientServiceContext } from "services/clientServiceProvider";
import DashboardHeaderSection from "pages/dashbaord/DashboardHeaderSection";

import CallScriptIcon from "./CallScriptIcon";
import ContactSearch from "./ContactSearch";
import CreateNewContact from "./CreateNewContact";
import PossibleMatches from "./PossibleMatches";
import styles from "./styles.module.scss";
import BackButton from "components/BackButton";

export default function LinkToContact() {
    const navigate = useNavigate();
    const { callLogId, callFrom, duration, date } = useParams();

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
    const callIsAssigned = !callRecordings.some((callRecording) => callRecording?.callLogId === parseInt(callLogId));

    const getContacts = async (searchStr) => {
        setIsLoading(true);
        try {
            const response = await clientsService.getList(
                undefined,
                undefined,
                ["Activities.CreateDate:desc"],
                searchStr,
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

    const bannerContent = () => {
        return (
            <>
                <BackButton />
                <Heading3 text="Link to contacts" />
                <div>
                    <Button size={"medium"} startIcon={<CallScriptIcon />} onClick={() => setModalOpen(true)}>
                        Call Script
                    </Button>
                </div>
            </>
        );
    };

    const extractAndFlattenTags = (callLogs) => {
        const flattenedTags = callLogs.flatMap((callLog) =>
            callLog.callLogTags.map((tagInfo) => ({
                tagId: tagInfo.tag.tagId,
                tagLabel: tagInfo.tag.tagLabel,
            })),
        );

        // Remove potential duplicates based on tagId
        const uniqueTags = Array.from(new Map(flattenedTags.map((tag) => [tag.tagId, tag])).values());

        return uniqueTags;
    };

    // Extract and flatten tags from the provided data
    const flattenedTags = callsRecordingTags?.length > 0 ? extractAndFlattenTags(callsRecordingTags) : [];

    const tagIds = flattenedTags?.map((tag) => tag.tagId);

    const arrayToString = tagIds?.length > 0 ? tagIds?.join(", ") : "";

    const goToAddNewContactsPage = useCallback(() => {
        const baseRoute = `/contact/add-new/`;
        const logIdParam = callLogId ? `${callLogId}` : "";
        const tagsParam = tagIds ? `tags=${tagIds}` : "";
        const callFromParam = callFrom ? `callFrom=${callFrom}` : "";
        const queryParams = [tagsParam, callFromParam].filter(Boolean).join("&");

        const route = `${baseRoute}${logIdParam}${queryParams ? `?${queryParams}` : ""}`;
        navigate(route);
    }, [callLogId, tagIds, callFrom, navigate]);

    return (
        <>
            <Helmet>
                <title>Integrity - Link to Contact</title>
            </Helmet>
            <GlobalNav />
            <DashboardHeaderSection
                content={bannerContent()}
                justifyContent={"space-between"}
                padding={"0 15%"}
                className={styles.headerSection}
            />
            <div className={styles.outerContainer}>
                <div className={styles.innerContainer}>
                    <div className={styles.medContent}>
                        <Heading2 text={formatPhoneNumber(callFrom, true)} />
                    </div>
                    <div className={styles.callRecording}>
                        <div className={styles.content}>Call recorded</div>
                        <div className={styles.content}>{dateFormatter(date, "MM/DD/yyyy hh:mm A")}</div>
                        <div className={`${styles.content} ${styles.mt10}`}>Duration: {duration} </div>
                    </div>
                    {flattenedTags?.length > 0 ? (
                        <div className={styles.medContent}>
                            <Tags words={flattenedTags} flexDirection={"column"} />
                        </div>
                    ) : null}
                    {callIsAssigned ? (
                        <div className={styles.medContent}>
                            <div className={styles.content}>This call is already assigned to a lead.</div>
                        </div>
                    ) : (
                        <>
                            <PossibleMatches phone={callFrom} tagIds={tagIds} />
                            <div className={styles.medContent}>
                                <CreateNewContact goToAddNewContactsPage={goToAddNewContactsPage} />
                            </div>
                            <div className={styles.medContent}>
                                <ContactSearch
                                    isLoading={isLoading}
                                    onChange={getContacts}
                                    contacts={contacts}
                                    tagIds={tagIds}
                                />
                            </div>
                        </>
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
