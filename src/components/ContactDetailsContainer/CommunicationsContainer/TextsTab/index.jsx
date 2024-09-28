import { useEffect, useMemo, useState } from "react";
import * as Sentry from "@sentry/react";
import { Box, TextareaAutosize, Typography, Button, Tooltip } from "@mui/material";
import PlusIcon from "components/icons/plus";
import styles from "./TextsTab.module.scss";
import MessageCard from "./MessageCard";
import SendMessageIcon from "components/icons/version-2/SendMessage";
import { useCallsHistory, useLeadDetails } from "providers/ContactDetails";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import useToast from "hooks/useToast";
import useAnalytics from "hooks/useAnalytics";

const MAX_CHARACTERS_LENGTH = 160;

const TextsTab = () => {
    const [isNewTextInputOpen, setIsNewTextInputOpen] = useState(false);
    const [newMessageValue, setNewMessageValue] = useState("");
    const { postSendMessage, getMessageList, messageList, postUpdateMessageRead, messageListLoading } =
        useCallsHistory();
    const { agentInformation } = useAgentInformationByID();
    const { agentFirstName, agentLastName, agentID, agentNPN, agentVirtualPhoneNumber } = agentInformation || {};
    const { leadDetails } = useLeadDetails();
    const { showToast } = useToast();
    const formattedPhoneNumber = agentVirtualPhoneNumber?.replace(/^\+1/, "");
    const { fireEvent } = useAnalytics();

    const isSmsCompatible = useMemo(() => {
        return leadDetails?.phones?.[0]?.isSmsCompatible;
    }, [leadDetails?.phones]);

    useEffect(() => {
        getMessageList(agentNPN, leadDetails.leadsId);
    }, [getMessageList, agentNPN, leadDetails.leadsId]);

    useEffect(() => {
        const smsLogIds = messageList
            .filter((item) => !item.hasViewed && (item.smsType === "inbound" || !item.isFreeForm))
            .map((item) => item.id);
        if (smsLogIds.length) {
            postUpdateMessageRead({ smsLogIds });
        }
    }, [messageList]);

    const handleMessageChange = (value) => {
        if (value.length > MAX_CHARACTERS_LENGTH) {
            return;
        }
        setNewMessageValue(value);
    };

    const handleSendMessage = async () => {
        try {
            const response = await postSendMessage({
                agentFirstName,
                agentLastName,
                agentID,
                agentNPN,
                agentPhone: formattedPhoneNumber,
                leadFirstName: leadDetails.firstName,
                leadId: leadDetails.leadsId.toString(),
                leadLastName: leadDetails.lastName,
                leadPhone: leadDetails.phones?.[0]?.leadPhone || "",
                messageBody: newMessageValue,
            });
            if (response.ok) {
                await getMessageList(agentNPN, leadDetails.leadsId);
                setNewMessageValue("");
                setIsNewTextInputOpen(false);
                fireEvent("Connect Communication Sent", {
                    communicationMethod: "text",
                    leadId: leadDetails.leadsId,
                });
            }
        } catch (error) {
            Sentry.captureException(error);
            showToast({
                type: "error",
                message: "Failed to send message",
            });
        }
    };

    const sortedMessageList = [...messageList].sort(
        (a, b) => new Date(b.createdDateTime) - new Date(a.createdDateTime)
    );

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }} className={styles.textsContainer}>
            <div className={styles.headerContainer}>
                <div className={styles.messagesLengthTitle}>{messageList.length} messages</div>
                <div className={styles.sendNewTextButton}>
                    <Tooltip
                        title={isSmsCompatible ? "" : "Please add a valid phone number that can accept text messages."}
                        placement="top"
                        arrow
                    >
                        <span>
                            {/* Wrapping button in a span to ensure the tooltip works when the button is disabled */}
                            <Button
                                variant="contained"
                                onClick={() => setIsNewTextInputOpen(true)}
                                endIcon={<PlusIcon strokeColor="#fff" />}
                                disabled={!isSmsCompatible}
                                size="medium"
                            >
                                Send a new text
                            </Button>
                        </span>
                    </Tooltip>
                </div>
            </div>
            {isNewTextInputOpen && (
                <div className={styles.newMessageBox}>
                    <Typography className={styles.fieldLabel}>Message</Typography>
                    <TextareaAutosize
                        value={newMessageValue}
                        placeholder="Type a message here to send."
                        className={styles.newMessageTextarea}
                        onChange={(e) => handleMessageChange(e.target.value)}
                    />
                    <div className={styles.charactersRemainingBox}>
                        {MAX_CHARACTERS_LENGTH - newMessageValue.length} characters remaining
                    </div>
                    <div className={styles.newMessageFooter}>
                        <Button
                            variant="text"
                            onClick={() => {
                                setIsNewTextInputOpen(false);
                                setNewMessageValue("");
                            }}
                            size="small"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={messageListLoading || !(newMessageValue?.length > 2)}
                            onClick={messageListLoading ? null : handleSendMessage}
                            endIcon={<SendMessageIcon />}
                            size="small"
                        >
                            {messageListLoading ? "Sending..." : "Send"}
                        </Button>
                    </div>
                </div>
            )}
            <div className={styles.messagesContainer}>
                {sortedMessageList.map((item) => (
                    <MessageCard key={item.id} smsType={item.smsType} data={item} />
                ))}
            </div>
        </Box>
    );
};

export default TextsTab;
