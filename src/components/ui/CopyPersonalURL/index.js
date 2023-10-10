import React, { useCallback } from "react";
import * as Sentry from "@sentry/react";
import { Button } from "components/ui/Button";
import Link from "components/icons/link";
import styles from "./index.module.scss";
import useToast from "hooks/useToast";
import useAgentInformationByID from "hooks/useAgentInformationByID";

const PERSONAL_URL_DESCRIPTION =
  "Send your personalized link to the client to get them started with shopping for plans. Don't worry, you will get credit if the consumer enrolls in any of these plans.";
const URL = process.env.REACT_APP_MEDICARE_ENROLL;

const CopyPersonalURL = () => {
  const {
    agentInformation: { agentPurl },
  } = useAgentInformationByID();
  const showToast = useToast();

  const handleOnClickCopy = useCallback(async () => {
    if (!agentPurl) return;

    try {
      await navigator.clipboard.writeText(`${URL}/?purl=${agentPurl}`);
      showToast({
        message: "Successfully copied to Clipboard.",
      });
    } catch (error) {
      Sentry.captureException(error);
      showToast({
        type: "error",
        message: "Error while copying the code.",
      });
    }
  }, [agentPurl, showToast]);

  return (
    <>
      <div className={styles.purlContent}>{PERSONAL_URL_DESCRIPTION}</div>
      <Button
        className="mt-2"
        icon={<Link />}
        label="Copy Link"
        onClick={handleOnClickCopy}
      />
    </>
  );
};

export default CopyPersonalURL;
