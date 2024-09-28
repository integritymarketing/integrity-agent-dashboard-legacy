import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Container, Tabs, Tab, Grid, Badge } from "@mui/material";
import { CallHistory, CampaignTypeTextMessage, EditBox } from "@integritymarketing/icons";
import styles from "./CommunicationsContainer.module.scss";
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
    const { getCallsList, callsList = [], unviewedCallCount } = useCallsHistory();
    const { fireEvent } = useAnalytics();

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

        if (selectedTab === "calls" && newValue !== "calls") {
            getCallsList(leadId);
        }
        setSelectedTab(newValue);
        params.set("tab", newValue);
        setTabSelectedInitial(newValue);
    };
    const unReadMessagesCount = useMemo(() => {
        return messageList.filter((item) => !item.hasViewed && (item.smsType === "inbound" || !item.isFreeForm))
            ?.length;
    }, [messageList]);

    return (
        <Container sx={{ mx: { xs: "1rem", sm: "2rem", md: "5rem" } }}>
            <Grid container>
                <Grid item xs={12}>
                    <Tabs
                        value={tabs[selectedTab].position}
                        aria-label="communications-tabs"
                        variant="fullWidth"
                        className={styles.tabs}
                    >
                        <Tab
                            active={selectedTab === "texts"}
                            activeColor="primary"
                            onClick={() => handleTabChange("texts")}
                            label={
                                <div
                                    className={`${styles.tabTextContainer} ${
                                        selectedTab != "texts" ? styles.inactiveTab : ""
                                    }`}
                                >
                                    {!isMobile && "Texts"}
                                    <Badge>
                                        <div className={styles.tabIconContainer}>
                                            <CampaignTypeTextMessage className={styles.tabIcon} />
                                        </div>
                                        {unReadMessagesCount > 0 && (
                                            <Badge
                                                color={selectedTab === "texts" ? "primary" : "info"}
                                                badgeContent={unReadMessagesCount}
                                                className={styles.tabCountBadge}
                                            />
                                        )}
                                    </Badge>
                                </div>
                            }
                        />
                        <Tab
                            active={selectedTab === "calls"}
                            activeColor="primary"
                            onClick={() => handleTabChange("calls")}
                            label={
                                <div
                                    className={`${styles.tabTextContainer} ${
                                        selectedTab != "calls" ? styles.inactiveTab : ""
                                    }`}
                                >
                                    {!isMobile && "Calls"}
                                    <Badge>
                                        <div className={styles.tabIconContainer}>
                                            <CallHistory size="md" className={styles.tabIcon} />
                                        </div>
                                        {unviewedCallCount > 0 && (
                                            <Badge
                                                color="primary"
                                                badgeContent={unviewedCallCount}
                                                className={styles.tabCountBadge}
                                            />
                                        )}
                                    </Badge>
                                </div>
                            }
                        />
                        <Tab
                            active={selectedTab === "scope-of-appointment"}
                            activeColor="primary"
                            onClick={() => handleTabChange("scope-of-appointment")}
                            iconPosition="end"
                            label={
                                <div
                                    className={`${styles.tabTextContainer} ${
                                        selectedTab != "scope-of-appointment" ? styles.inactiveTab : ""
                                    }`}
                                >
                                    {!isMobile && "SOAs"}
                                    <Badge>
                                        <div className={styles.tabIconContainer}>
                                            <EditBox className={styles.tabIcon} />
                                        </div>
                                    </Badge>
                                </div>
                            }
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
