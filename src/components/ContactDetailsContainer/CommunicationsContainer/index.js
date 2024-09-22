import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Container, Tabs, Tab, Grid } from "@mui/material";
import TextIcon from "components/icons/version-2/TextIcon";
import styles from "./CommunicationsContainer.module.scss";
import CallIcon from "components/icons/callicon";
import EditBoxIcon from "components/icons/version-2/EditBox";
import CallsContainerTab from "./CallsContainerTab";
import SOAsContainerTab from "./SOAsContainerTab";
import useQueryParams from "hooks/useQueryParams";
import TextsTab from "./TextsTab";
import { useWindowSize } from "hooks/useWindowSize";
import { useCallsHistory } from "providers/ContactDetails/ContactDetailsContext";
import useAnalytics from "hooks/useAnalytics";
const CommunicationsContainer = ({ tabSelectedInitialParam, setTabSelectedInitial }) => {
    const params = useQueryParams();
    const { width: windowWidth } = useWindowSize();
    const { messageList } = useCallsHistory();
    const isMobile = windowWidth <= 784;
    const [selectedTab, setSelectedTab] = useState(tabSelectedInitialParam || "texts");

    const { leadId } = useParams();
    const { getCallsList, callsList = [] } = useCallsHistory();
    const { fireEvent } = useAnalytics();
    const unviewedCallCount = callsList.filter((c) => !c.hasViewed).length;

    const tabs = useMemo(
        () => ({
            texts: {
                key: "texts",
                position: 0,
                component: <TextsTab />,
            },
            calls: {
                key: "calls",
                position: 1,
                component: <CallsContainerTab />,
            },
            "scope-of-appointment": {
                key: "scope-of-appointment",
                position: 2,
                component: <SOAsContainerTab />,
            },
        }),
        []
    );

    useEffect(() => {
        if (leadId) {
            getCallsList(leadId);
        }
    }, [getCallsList, leadId]);

    useEffect(() => {
        if (tabSelectedInitialParam) {
            setSelectedTab(tabSelectedInitialParam);
            params.set("tab", tabSelectedInitialParam);
        }
    }, [tabSelectedInitialParam, params]);

    const handleTabChange = (newValue) => {

        if (newValue === "texts" && unReadMessagesCount > 0) {
            fireEvent("Connect Communication Read", {
                communicationMethod: "text messages",
                leadId: leadId,
            });
            console.log("Analytics event fired for reading unread text messages");
        }

        if (newValue === "calls" && unviewedCallCount > 0) {
            fireEvent("Connect Communication Read", {
                communicationMethod: "call history",
                leadId: leadId,
            });
        }
        setSelectedTab(newValue);
        params.set("tab", newValue);
        setTabSelectedInitial(newValue);
    };
    const unReadMessagesCount = useMemo(() => {
        return messageList.filter((item) => !item.hasViewed && item.smsType === "inbound").length;
    }, [messageList]);
    return (
        <Container sx={{ mx: { xs: "1rem", sm: "2rem", md: "5rem" } }}>
            <Grid container>
                <Grid item xs={12}>
                    <Tabs value={tabs[selectedTab].position} aria-label="communications-tabs" variant="fullWidth">
                        <Tab
                            className={`${styles.tab} ${styles.tab1} ${selectedTab === "texts" ? styles.selectedTab : ""}`}
                            icon={<TextIcon />}
                            onClick={() => handleTabChange("texts")}
                            iconPosition="end"
                            label={
                                <div className={styles.tabCountContainer}>
                                    {!isMobile && "Texts"}{" "}
                                    {unReadMessagesCount ? (
                                        <span className={styles.tabCount}>{unReadMessagesCount}</span>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            }
                        />
                        <Tab
                            className={`${styles.tab} ${selectedTab === "calls" ? styles.selectedTab : ""}`}
                            icon={<CallIcon />}
                            onClick={() => handleTabChange("calls")}
                            iconPosition="end"
                            label={
                                <div className={styles.tabCountContainer}>
                                    {!isMobile && "Calls"}{" "}
                                    {unviewedCallCount > 0 && (
                                        <span className={styles.tabCount}>{unviewedCallCount}</span>
                                    )}
                                </div>
                            }
                        />
                        <Tab
                            className={`${styles.tab} ${selectedTab === "scope-of-appointment" ? styles.selectedTab : ""}`}
                            icon={<EditBoxIcon />}
                            onClick={() => handleTabChange("scope-of-appointment")}
                            iconPosition="end"
                            label={isMobile ? "" : "SOAs"}
                        />
                    </Tabs>
                </Grid>
                <Grid item xs={12}>
                    {tabs[selectedTab].component}
                </Grid>
            </Grid>
        </Container>
    );
};

CommunicationsContainer.propTypes = {
    tabSelectedInitialParam: PropTypes.string,
    setTabSelectedInitial: PropTypes.func.isRequired,
};

export default CommunicationsContainer;
