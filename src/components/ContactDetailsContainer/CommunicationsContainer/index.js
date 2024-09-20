import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Tabs, Tab, Grid, Box } from "@mui/material";
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

const CommunicationsContainer = ({ tabSelectedInitialParam, setTabSelectedInitial }) => {
    const params = useQueryParams();
    const tabSelectedInitial = tabSelectedInitialParam;
    const { width: windowWidth } = useWindowSize();
    const isMobile = windowWidth <= 784;
    const [selectedTab, setSelectedTab] = useState("texts");

    const { leadId } = useParams();
    const { getCallsList, callsList = [] } = useCallsHistory();
    const unviewedCallCount = callsList.filter(c => !c.hasViewed).length;

    const tabs = {
        texts: {
            key: "texts",
            position: 0,
            component: <TextsTab />
        },
        calls: {
            key: "calls",
            position: 1,
            component: <CallsContainerTab />
        },
        "scope-of-appointment": {
            key: "scope-of-appointment",
            position: 2,
            component: <SOAsContainerTab />
        }
    }

    useEffect(() => {
        if (leadId) getCallsList(leadId);
    }, [getCallsList, leadId])

    useEffect(() => {
        if (tabSelectedInitial) {
            setSelectedTab(tabSelectedInitial);
            params.set("tab", tabSelectedInitial);
        }
    }, [tabSelectedInitial]);

    const handleTabChange = (newValue) => {
        if (selectedTab === "calls" && newValue != "calls") getCallsList(leadId);
        setSelectedTab(newValue);
        params.set("tab", newValue);
        setTabSelectedInitial(newValue);
    };

    return (
        <Container sx={{ mx: { xs: "1rem", sm: "2rem", md: "5rem" } }}>
            <Grid container>
                <Grid item xs={12}>
                    <Tabs value={tabs[selectedTab].position} aria-label="texts" variant="fullWidth">
                        <Tab
                            className={`${styles.tab} ${styles.tab1} ${selectedTab === "texts" ? styles.selectedTab : ""}`}
                            icon={<TextIcon />}
                            onClick={() => handleTabChange("texts")}
                            iconPosition="end"
                            label={
                                <div className={styles.tabCountContainer}>
                                    {!isMobile && "Texts"} <span className={styles.tabCount}>11</span>
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
                                    {!isMobile && "Calls"} {unviewedCallCount > 0 && (
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

export default CommunicationsContainer;
