import React, { useMemo, useCallback, useContext } from "react";
import * as Sentry from "@sentry/react";
import { formatPhoneNumber } from "utils/phones";
import callRecordingsService from "services/callRecordingsService";
import clientsService from "services/clientsService";
import AuthContext from "contexts/auth";
import styles from "./ContactsPage.module.scss";

export default function PrimaryContactPhone({ phone, leadsId }) {
  const auth = useContext(AuthContext);

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
    const agentData = await getAgentAvailability();
    callRecordingsService.outboundCallFromMedicareCenter({
      agentId: agentData.agentID,
      leadId: leadsId,
      agentTwilioNumber: agentData.virtualPhoneNumber,
      agentPhoneNumber: agentData.phone,
      customerNumber: phone[0],
    });
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <a href={() => false} className={styles.link} onClick={onPhoneClickHandler}>
      {formatContactNumber}
    </a>
  );
}
