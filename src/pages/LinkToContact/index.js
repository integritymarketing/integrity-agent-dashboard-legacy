import * as Sentry from "@sentry/react";
import AuthContext from "contexts/auth";
import ContactSearch from "./ContactSearch";
import DashboardHeaderSection from "pages/dashbaord/DashboardHeaderSection";
import DescriptionIcon from "@mui/icons-material/Description";
import Footer from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import Heading3 from "packages/Heading3";
import React, { useEffect, useState, useContext } from "react";
import Tags from "packages/Tags/Tags";
import clientService from "services/clientsService";
import styles from "./styles.module.scss";
import { CallScriptModal } from "packages/CallScriptModal";
import { Helmet } from "react-helmet-async";
import { TextButton, Button } from "packages/Button";
import { formatPhoneNumber } from "utils/phones";
import { useHistory, useParams } from "react-router-dom";
import useCallRecordings from "hooks/useCallRecordings";
import Heading2 from "packages/Heading2";

const IN_PROGRESS = "in-progress";

export default function LinkToContact() {
  const history = useHistory();
  const { callLogId } = useParams();
  const auth = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [agentInformation, setAgentInformation] = useState({});
  const callRecordings = useCallRecordings({ subscribe: false });
  const callStatusInProgress = callRecordings.find(
    (callRecording) => callRecording.callStatus === IN_PROGRESS
  );

  useEffect(() => {
    const loadAsyncData = async () => {
      try {
        const user = await auth.getUser();
        const agentId = user?.profile?.agentid;
        const agentInfo = await clientService.getAgentAvailability(agentId);
        setAgentInformation(agentInfo);
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    loadAsyncData();
  }, [auth]);

  const getContacts = async (searchStr) => {
    const response = await clientService.getList(
      undefined,
      undefined,
      "Activities.CreateDate:desc",
      searchStr
    );
    if (response && response.result) {
      setContacts(response.result);
    }
  };

  const bannerContent = () => {
    return (
      <>
        <Heading3 text="Link to contact" />
        <div>
          <Button
            size={"medium"}
            startIcon={<DescriptionIcon />}
            onClick={() => setModalOpen(true)}
          >
            Call Script
          </Button>
        </div>
      </>
    );
  };

  const goToAddNewContactsPage = () => {
    history.push(`/contact/add-new/${callLogId}`);
  };

  const tags = callStatusInProgress?.callLogTags.map(
    (callLogTag) => callLogTag.tag.tagLabel
  );

  return (
    <>
      <Helmet>
        <title>MedicareCENTER - Link To Contact</title>
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
            <Heading2
              text={formatPhoneNumber(
                agentInformation?.agentVirtualPhoneNumber,
                true
              )}
            />
          </div>
          {tags?.length && (
            <div className={styles.medContent}>
              <Tags words={tags} flexDirection={"column"} />
            </div>
          )}
          <div className={styles.medContent}>
            <TextButton
              onClick={goToAddNewContactsPage}
              variant={"outlined"}
              size={"large"}
            >
              Create new contact
            </TextButton>
          </div>
          <div className={styles.medContent}>
            <ContactSearch onChange={getContacts} contacts={contacts} />
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
