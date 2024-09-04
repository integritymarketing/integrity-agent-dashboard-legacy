import { useEffect, useState } from "react";
import { Container, Tabs, Tab, Grid, Box } from "@mui/material";
import TextIcon from "components/icons/version-2/TextIcon";
import styles from "./CommunicationsContainer.module.scss";
import CallIcon from "components/icons/callicon";
import EditBoxIcon from "components/icons/version-2/EditBox";
import SOAsContainerTab from "./SOAsContainerTab";
import useQueryParams from "hooks/useQueryParams";
import TextsTab from "./TextsTab";
import { useWindowSize } from "hooks/useWindowSize";

const CommunicationsContainer = ({ tabSelectedInitialParam, setTabSelectedInitial }) => {
    const params = useQueryParams();
    const tabSelectedInitial = tabSelectedInitialParam;
    const [selectedTab, setSelectedTab] = useState(0);
    const { width: windowWidth } = useWindowSize();
    const isMobile = windowWidth <= 784;

    useEffect(() => {
        if (tabSelectedInitial) {
            if (tabSelectedInitial === "texts") {
                setSelectedTab(0);
                params.set("tab", "texts");
            } else if (tabSelectedInitial === "calls") {
                setSelectedTab(1);
                params.set("tab", "calls");
            } else if (tabSelectedInitial === "scope-of-appointment") {
                setSelectedTab(2);
                params.set("tab", "scope-of-appointment");
            }
        }
    }, [tabSelectedInitial]);

    const handleTabChange = (newValue) => {
        setSelectedTab(newValue);
        if (newValue === 0) {
            params.set("tab", "texts");
            setTabSelectedInitial("texts");
        } else if (newValue === 1) {
            params.set("tab", "calls");
            setTabSelectedInitial("calls");
        } else if (newValue === 2) {
            params.set("tab", "scope-of-appointment");
            setTabSelectedInitial("scope-of-appointment");
        }
    };

    return (
        <Container sx={{ mx: { xs: "1rem", sm: "2rem", md: "5rem" } }}>
            <Grid container>
                <Grid item xs={12}>
                    <Tabs value={selectedTab} aria-label="texts" variant="fullWidth">
                        <Tab
                            className={`${styles.tab} ${styles.tab1} ${selectedTab === 0 ? styles.selectedTab : ""}`}
                            icon={<TextIcon />}
                            onClick={() => handleTabChange(0)}
                            iconPosition="end"
                            label={
                                <div className={styles.tabTexts}>
                                    {!isMobile && "Texts"} <span className={styles.tabTextsCount}>11</span>
                                </div>
                            }
                        />
                        <Tab
                            className={`${styles.tab} ${selectedTab === 1 ? styles.selectedTab : ""}`}
                            icon={<CallIcon />}
                            onClick={() => handleTabChange(1)}
                            iconPosition="end"
                            label={isMobile ? "" : "Calls"}
                        />
                        <Tab
                            className={`${styles.tab} ${selectedTab === 2 ? styles.selectedTab : ""}`}
                            icon={<EditBoxIcon />}
                            onClick={() => handleTabChange(2)}
                            iconPosition="end"
                            label={isMobile ? "" : "SOAs"}
                        />
                    </Tabs>
                </Grid>
                <Grid item xs={12}>
                    {selectedTab === 0 && <TextsTab />}
                    {selectedTab === 1 && (
                        <Box sx={{ p: { xs: 1, sm: 2 } }}>
                            <p>This is the sample content for the Calls tab.</p>
                        </Box>
                    )}
                    {selectedTab === 2 && <SOAsContainerTab />}
                </Grid>
            </Grid>
        </Container>
    );
};

export default CommunicationsContainer;
