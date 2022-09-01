import React, { useCallback, useEffect, useState } from 'react';
import * as Sentry from "@sentry/react"
import useToast from "hooks/useToast";
import { Button } from "components/ui/Button";
import Link from "components/icons/link";
import clientService from "services/clientsService";
import styles from './index.module.scss'

const PERSONAL_URL_DATA = "Send your personalized link to the client to get them started with shopping for plans. Don't worry, you will get credit if the consumer enrolls in any of these plans."

export default function CopyPersonalURL(props) {
  const { agentnpn } = props;
  const [purlCode, setPurlCode] = useState(null);
  const addToast = useToast();

  const getAgentPurlCodeWithNPN = useCallback(async () => {
    const URL = process.env.REACT_APP_MEDICARE_ENROLL;
    try {
      let data = await clientService.getAgentPurlCodeByNPN(agentnpn);
      if (!data) {
        data = await clientService.createAgentPurlCode({
          agentNpn: agentnpn
        });
      }
      setPurlCode(`${URL}/?purl=${data.agentPurlCode}`);
    } catch (error) {
      addToast({
        type: "error",
        message: "Failed to get the purl code.",
        time: 10000,
      });
      Sentry.captureException(error);
    }
  }, [agentnpn, addToast]);

  useEffect(() => {
    getAgentPurlCodeWithNPN()
  }, [getAgentPurlCodeWithNPN]);

  const handleOnClickCopy = async () => {
    if (purlCode) {
      try {
        await navigator.clipboard.writeText(purlCode);
        addToast({
          message: "Successfully copied to Clipboard.",
        });
      } catch (error) {
        addToast({
          type: "error",
          message: "Error while copying the code.",
        });
      }
    }

  };

  return (
    <>
      <div className={styles.purlContent}>{PERSONAL_URL_DATA}</div>
      <Button
        className='mt-2'
        icon={<Link />}
        label="Copy Link"
        onClick={handleOnClickCopy}
      />
    </>
  )
}
