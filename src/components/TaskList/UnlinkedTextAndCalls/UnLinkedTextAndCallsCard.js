import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { convertUTCDateToLocalDate, convertToLocalDateTime } from "utils/dates";
import { ContactLink, Download, CallHistory, View, Sms } from "@integritymarketing/icons";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import IconBackGround from "components/ui/IconBackGround";
import styles from "./styles.module.scss";
import UnlinkedTextModal from "./UnlinkedTextModal";
import OutBoundCall from "components/OutBoundCall";

const UnLinkedTextAndCallsCard = ({ task }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down("sm"));
    const isTabletView = useMediaQuery(theme.breakpoints.down("md"));

    const [isUnlinkedTextModalOpen, setIsUnlinkedTextModalOpen] = useState(false);

    const isSms = task?.smsContent;
    const name = isSms ? "Text" : "Call";

    const linkToContact = () => {
        const date = convertUTCDateToLocalDate(task?.taskDate);
        const queryParams = new URLSearchParams({
            id: task?.id,
            phoneNumber: task?.phoneNumber,
            duration: task?.duration,
            date: date,
            name: name,
            url: task?.recordingUrl,
            smsText: task?.smsContent,
        }).toString();

        navigate(`/link-to-contact?${queryParams}`);
    };

    const handleDownloadAndTextClick = () => {
        if (isSms) {
            setIsUnlinkedTextModalOpen(true);
        } else {
            const recordingUrl = task?.recordingUrl;
            const link = document.createElement("a");
            link.href = recordingUrl;
            link.download = "call_recording.mp3";
            link.click();
        }
    };

    const API_Phone = task?.phoneNumber?.replace("+1", "");

    return (
        <Box className={styles.unlinkedCard}>
            <Grid container className={styles.unlinkedCardGridContainer}>
                <Grid item md={3} xs={12}>
                    <Box className={styles.contactInfo}>
                        <Box marginRight="8px">
                            <IconBackGround>
                                {isSms ? <Sms size="xl" color="#4178FF" /> : <CallHistory color="#4178FF" size="md" />}
                            </IconBackGround>
                        </Box>

                        <Box className={styles.contactNumber}>
                            <Typography variant="body1" color="#434A51">
                                Unlinked {isSms ? "Text" : "Call"}
                            </Typography>
                            <OutBoundCall leadPhone={API_Phone} view="task" />
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Box className={styles.contactNumber}>
                        <Box display="flex">
                            <Typography variant="h5" className={styles.label}>
                                Date:
                            </Typography>
                            <Typography variant="body1" color="#434A51">
                                {convertToLocalDateTime(task?.taskDate).format("MM/DD/yyyy")}
                            </Typography>
                        </Box>
                        <Box display="flex">
                            <Typography variant="h5" className={styles.label}>
                                Time:
                            </Typography>
                            <Typography variant="body1" color="#434A51">
                                {convertToLocalDateTime(task?.taskDate).format("h:mm a")}
                            </Typography>
                        </Box>
                        {!isSms && (
                            <Box display="flex">
                                <Typography variant="h5" className={styles.label}>
                                    Duration:
                                </Typography>
                                <Typography variant="body1" color="#434A51">
                                    {task?.duration}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>
                <Grid item md={3} xs={2}>
                    <Box className={styles.iconBox}>
                        {isMobileView || isTabletView ? (
                            <Box onClick={handleDownloadAndTextClick}>
                                {isSms ? <View color="#4178FF" size="lg" /> : <Download color="#4178FF" size="lg" />}
                            </Box>
                        ) : (
                            <Button
                                onClick={handleDownloadAndTextClick}
                                variant="text"
                                color="primary"
                                size="small"
                                endIcon={
                                    isSms ? <View color="#4178FF" size="lg" /> : <Download color="#4178FF" size="lg" />
                                }
                            >
                                {isSms ? "View Text" : "Download Call"}
                            </Button>
                        )}
                    </Box>
                </Grid>
                <Grid item md={3} xs={10}>
                    <Box className={styles.linkContactButton}>
                        <Button
                            onClick={linkToContact}
                            variant="contained"
                            color="primary"
                            size="medium"
                            endIcon={<ContactLink color="#ffffff" size="md" />}
                        >
                            Link to Contact
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <UnlinkedTextModal
                isModalOpen={isUnlinkedTextModalOpen}
                setIsModalOpen={() => setIsUnlinkedTextModalOpen(false)}
                linkToContact={linkToContact}
                smsContent={isSms}
                time={convertToLocalDateTime(task?.taskDate).format("h:mm a")}
                date={convertToLocalDateTime(task?.taskDate).format("MM/DD/yyyy")}
            />
        </Box>
    );
};

UnLinkedTextAndCallsCard.propTypes = {
    task: PropTypes.object,
};

export default UnLinkedTextAndCallsCard;
