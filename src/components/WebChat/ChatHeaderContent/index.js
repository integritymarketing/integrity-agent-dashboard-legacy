import PropTypes from "prop-types";
import { Button, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCircleArrowLeft} from "@awesome.me/kit-7ab3488df1/icons/classic/light";
import styles from "./ChatHeaderContent.module.scss";

const ChatHeaderContent = ({
    contactFullName,
    clearChatAndFetchToken,
    closeChat,
    handleOpenAskIntegrityFeedback,
    ChatIcon,
    HideIcon,
}) => (
    <>
    {!contactFullName ? (
            <div className={styles.header}>
                <img className={styles.logoIcon} onClick={clearChatAndFetchToken} src={ChatIcon} alt="Chat Icon" />
                <p className={styles.headerText}>
                    <span>Ask Integrity</span>
                    <FontAwesomeIcon className={styles.infoLogo} onClick={handleOpenAskIntegrityFeedback} icon={faCircleInfo} color="#4178FF" size={"lg"} />
                </p>
                <img onClick={closeChat} className={styles.hideIcon} src={HideIcon} alt="Hide Icon" />
            </div>
        ) : (
            <div className={styles.contactHeader }>
            <div className={styles.customHeaderContent}>
                <Button
                    startIcon={<FontAwesomeIcon icon={faCircleArrowLeft} color="#4178FF" />}
                    onClick={closeChat}
                    variant="text"
                    color="primary"
                    size="small"
                >
                    Back
                </Button>
                <Typography variant="h4" color="#FFFFFF">
                {contactFullName}
                </Typography>
                <FontAwesomeIcon className={styles.infoLogo} onClick={handleOpenAskIntegrityFeedback} icon={faCircleInfo} color="#4178FF" size={"lg"} />
            </div>
            </div>
        )}
    </>
);

ChatHeaderContent.propTypes = {
    contactFullName: PropTypes.string,
    clearChatAndFetchToken: PropTypes.func.isRequired,
    closeChat: PropTypes.func.isRequired,
    handleOpenAskIntegrityFeedback: PropTypes.func.isRequired,
    ChatIcon: PropTypes.string.isRequired,
    HideIcon: PropTypes.string.isRequired,
};

export default ChatHeaderContent;