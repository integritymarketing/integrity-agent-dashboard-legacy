import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { convertUTCDateToLocalDate, convertToLocalDateTime } from "utils/dates";
import { formatPhoneNumber } from "utils/phones";
import { ContactLink, Download, CallHistory, View, Sms } from "@integritymarketing/icons";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import IconBackGround from "components/ui/IconBackGround";
import styles from "./styles.module.scss";
import UnlinkedTextModal from "./UnlinkedTextModal";

const UnLinkedTextAndCallsCard = ({ task }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down("sm"));

    const [isUnlinkedTextModalOpen, setIsUnlinkedTextModalOpen] = useState(false);

    const linkToContact = () => {
        const date = convertUTCDateToLocalDate(task?.taskDate);
        navigate(`/link-to-contact/${task?.id}/${task?.phoneNumber}/${task?.duration}/${date}`);
    };

    const handleDownloadAndTextClick = () => {
        if (task?.smsContent) {
            setIsUnlinkedTextModalOpen(true);
        } else {
            const recordingUrl = task?.recordingUrl;
            const link = document.createElement("a");
            link.href = recordingUrl;
            link.download = "call_recording.mp3";
            link.click();
        }
    };

    return (
        <Box className={styles.unlinkedCard}>
            <Grid container className={styles.unlinkedCardGridContainer}>
                <Grid item md={4} xs={12}>
                    <Box className={styles.contactInfo}>
                        <Box className={styles.iconBox}>
                            <IconBackGround>
                                {task?.smsContent ? (
                                    <Sms size="xl" color="#4178FF" />
                                ) : (
                                    <CallHistory color="#4178FF" size="md" />
                                )}
                            </IconBackGround>
                        </Box>

                        <Box className={styles.contactNumber}>
                            <Typography variant="body1" color="#434A51">
                                Unlinked Call
                            </Typography>
                            <Typography variant="h4" className={styles.phoneNumber}>
                                {formatPhoneNumber(task?.phoneNumber, true)}
                            </Typography>
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
                        <Box display="flex">
                            <Typography variant="h5" className={styles.label}>
                                Duration:
                            </Typography>
                            <Typography variant="body1" color="#434A51">
                                {task?.duration}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={5} xs={12}>
                    <Box className={styles.linkToContact}>
                        <Box className={styles.iconBox}>
                            {isMobileView ? (
                                <Box onClick={handleDownloadAndTextClick}>
                                    {task?.smsContent ? (
                                        <View color="#4178FF" size="lg" />
                                    ) : (
                                        <Download color="#4178FF" size="lg" />
                                    )}
                                </Box>
                            ) : (
                                <Button
                                    onClick={handleDownloadAndTextClick}
                                    variant="text"
                                    color="primary"
                                    size="small"
                                    endIcon={
                                        task?.smsContent ? (
                                            <View color="#4178FF" size="lg" />
                                        ) : (
                                            <Download color="#4178FF" size="lg" />
                                        )
                                    }
                                >
                                    {task?.smsContent ? "View Text" : "DownLoad"}
                                </Button>
                            )}
                        </Box>

                        <Button
                            onClick={linkToContact}
                            variant="contained"
                            color="primary"
                            size="small"
                            endIcon={<ContactLink color="#ffffff" size={isMobileView ? "sm" : "md"} />}
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
                smsContent={task?.smsContent}
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
