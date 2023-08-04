import * as Sentry from "@sentry/react";
import ContactSearch from "./ContactSearch";
import DashboardHeaderSection from "pages/dashbaord/DashboardHeaderSection";
import CallScriptIcon from "./CallScriptIcon";
import Footer from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import Heading3 from "packages/Heading3";
import React, { useState } from "react";
import Tags from "packages/Tags/Tags";
import { useClientServiceContext } from "services/clientServiceProvider";
import styles from "./styles.module.scss";
import { CallScriptModal } from "packages/CallScriptModal";
import { Helmet } from "react-helmet-async";
import { Button } from "packages/Button";
import { formatPhoneNumber } from "utils/phones";
import { useHistory, useParams } from "react-router-dom";
import useCallRecordings from "hooks/useCallRecordings";
import Heading2 from "packages/Heading2";
import PossibleMatches from "./PossibleMatches";
import { dateFormatter } from "utils/dateFormatter";
import CreateNewContact from "./CreateNewContact";
import GoBackNavbar from "components/BackButtonNavbar";

export default function LinkToContact() {
  const { clientsService } = useClientServiceContext();
  const history = useHistory();
  const { callLogId, callFrom, duration, date } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const callRecordings = useCallRecordings();
  const callsRecordingTags = callRecordings.filter((callRecording) => {
    if (callRecording?.callLogId === parseInt(callLogId)) {
      return callRecording?.callLogTags;
    } else return null;
  });

  const getContacts = async (searchStr) => {
    setIsLoading(true);
    try {
      const response = await clientsService.getList(
        undefined,
        undefined,
        ["Activities.CreateDate:desc"],
        searchStr
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
        <Heading3 text="Link to contacts" />
        <div>
          <Button
            size={"medium"}
            startIcon={<CallScriptIcon />}
            onClick={() => setModalOpen(true)}
          >
            Call Script
          </Button>
        </div>
      </>
    );
  };

  const goToAddNewContactsPage = () => {
    history.push(
      `/contact/add-new/${callLogId || ""}${
        callFrom ? "?callFrom=" + callFrom : ""
      }`
    );
  };

  const tags =
    callsRecordingTags?.length > 0 &&
    callsRecordingTags[0]?.callLogTags?.map(
      (callLogTag) => callLogTag.tag.tagLabel
    );

  return (
    <>
      <Helmet>
        <title>MedicareCENTER - Link to Contact</title>
      </Helmet>
      <GlobalNav />
      <GoBackNavbar />
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
            <div className={styles.content}>
              {dateFormatter(date, "MM/DD/yyyy hh:mm A")}
            </div>
            <div className={`${styles.content} ${styles.mt10}`}>
              Duration: {duration}{" "}
            </div>
          </div>
          {tags?.length > 0 ? (
            <div className={styles.medContent}>
              <Tags words={tags} flexDirection={"column"} />
            </div>
          ) : null}
          <PossibleMatches phone={callFrom} />
          <div className={styles.medContent}>
            <CreateNewContact goToAddNewContactsPage={goToAddNewContactsPage} />
          </div>
          <div className={styles.medContent}>
            <ContactSearch
              isLoading={isLoading}
              onChange={getContacts}
              contacts={contacts}
            />
          </div>
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
