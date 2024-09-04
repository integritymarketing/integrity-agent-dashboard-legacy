import { useState } from "react";
import { Box } from "@mui/material";
import { Button } from "components/ui/Button";
import PlusIcon from "components/icons/plus";
import styles from "./TextsTab.module.scss";
import MessageCard from "./MessageCard";

const TextsTab = () => {
    const [openNewTextModal, setOpenNewTextModal] = useState(false);
    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <div className={styles.headerContainer}>
                <div className={styles.messagesLengthTitle}>{11} messages</div>
                <div className={styles.sendNewTextButton}>
                    <Button
                        label={"Send a new text"}
                        onClick={() => setOpenNewTextModal(true)}
                        type="primary"
                        icon={<PlusIcon strokeColor="#fff" />}
                        iconPosition="right"
                    />
                </div>
            </div>
            <div className={styles.messagesContainer}>
                <MessageCard type={"MY_TEXT_MESSAGE"} />
                <MessageCard type={"SYSTEM_TEXT_MESSAGE"} />
                <MessageCard type={"SYSTEM_TEXT_MESSAGE"} />
                <MessageCard type={"SYSTEM_TEXT_MESSAGE"} />
                <MessageCard type={"MY_TEXT_MESSAGE"} />
                <MessageCard type={"SYSTEM_TEXT_MESSAGE"} />
                <MessageCard type={"MY_BROADCAST_MESSAGE"} />
                <MessageCard type={"SYSTEM_TEXT_MESSAGE"} />
                <MessageCard type={"MY_TEXT_MESSAGE"} />
                <MessageCard type={"SYSTEM_TEXT_MESSAGE"} />
                <MessageCard type={"MY_TEXT_MESSAGE"} />
                <MessageCard type={"SYSTEM_TEXT_MESSAGE"} />
                <MessageCard type={"MY_TEXT_MESSAGE"} />
                <MessageCard type={"SYSTEM_TEXT_MESSAGE"} />
            </div>
        </Box>
    );
};

export default TextsTab;
