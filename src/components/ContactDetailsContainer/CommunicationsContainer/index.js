import { useState } from "react";
import { Container, Tabs, Tab, Grid, Box } from "@mui/material";
import TextIcon from "components/icons/version-2/TextIcon";

const CommunicationsContainer = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Container sx={{ mx: "5rem" }}>
            <Grid container>
                <Grid item xs={12}>
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        aria-label="texts"
                        centered
                        TabIndicatorProps={{ style: { width: "100%", left: "0px" } }}
                    >
                        <Tab icon={<TextIcon />} iconPosition="end" label="Texts" />
                    </Tabs>
                </Grid>
                <Grid item xs={12}>
                    {selectedTab === 0 && (
                        <Box sx={{ p: 2 }}>
                            <p>This is the sample content for the Texts tab.</p>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default CommunicationsContainer;
