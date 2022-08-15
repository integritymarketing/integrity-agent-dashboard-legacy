import React, { useMemo, useCallback, useContext, useState } from "react";
import * as Sentry from "@sentry/react";
import { formatPhoneNumber } from "utils/phones";
import callRecordingsService from "services/callRecordingsService";
import clientsService from "services/clientsService";
import AuthContext from "contexts/auth";
import styles from "./ContactsPage.module.scss";
import useToast from "hooks/useToast";
import { CallScriptModal } from "packages/CallScriptModal";

export default function PrimaryContactPhone({ phone, leadsId }) {
  const auth = useContext(AuthContext);
  const addToast = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const getAgentAvailability = async function () {
    try {
      const user = await auth.getUser();
      const { agentid } = user.profile;
      const data = await clientsService.getAgentAvailability(agentid);
      return data;
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const formatContactNumber = useMemo(() => formatPhoneNumber(phone), [phone]);

  const onPhoneClickHandler = useCallback(async (event) => {
    event.preventDefault();
    try {
      const agentData = await getAgentAvailability();
      const formattedPhoneNumber = agentData?.agentVirtualPhoneNumber?.replace(
        /^\+1/,
        ""
      );
      callRecordingsService.outboundCallFromMedicareCenter({
        agentId: agentData.agentID,
        leadId: `${leadsId}`,
        agentTwilioNumber: formattedPhoneNumber,
        agentPhoneNumber: agentData.phone,
        customerNumber: phone,
      });
      addToast({
        type: "success",
        message: "Call Intiated Successfully",
      });
      setModalOpen(true);
    } catch (error) {
      Sentry.captureException(error);
      addToast({
        type: "error",
        message: "There was an error please try again.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CallScriptModal
        modalOpen={modalOpen}
        handleClose={() => setModalOpen(false)}
      />
      <a
        href={() => false}
        className={styles.link}
        onClick={onPhoneClickHandler}
      >
        {formatContactNumber}
      </a>
    </>
  );
}
