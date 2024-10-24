import { Divider, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import styles from "./styles.module.scss";
import { Checkbox } from "components/ui/version-2/Checkbox";
import { ContactsCard } from "../ContactsCard";
import MapWithCount from "components/MapWithCount";
import { useContactsListContext } from "../providers/ContactsListProvider";
import { useState } from "react";
import SelectedAgentCard from "./SelectedAgentCard/SelectedAgentCard";

function ContactsMap() {
    const { setSelectedContactsAll } = useContactsListContext();
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isMapUILoading, setIsMapUILoading] = useState(true);

    return (
        <Grid container className={styles.container} spacing={1}>
            <Grid className={styles.clientsColumn} item xs={0} md={5}>
                <h2 className={styles.clientHeader}>Clients</h2>
                <Divider className={styles.clientsDivider} />
                {selectedAgent ? (
                    <Box className={styles.clientsCardsContainer}>
                        <SelectedAgentCard setSelectedAgent={setSelectedAgent} selectedAgent={selectedAgent} />
                    </Box>
                ) : (
                    <Box className={styles.clientsCardsContainer}>
                        <Checkbox
                            onChange={(event) => {
                                if (event.target.checked) {
                                    setSelectedContactsAll();
                                } else {
                                    setSelectedContactsAll(true);
                                }
                            }}
                        />
                        <span>Select All</span>
                        <ContactsCard isMapPage={true} cardWrapperClassName={styles.cardWrapperClassName} />
                    </Box>
                )}
            </Grid>
            <Grid className={styles.mapColumn} item xs={12} md={7}>
                <Box className={styles.selectAllCheckboxMobile}>
                    <Checkbox
                        onChange={(event) => {
                            if (event.target.checked) {
                                setSelectedContactsAll();
                            } else {
                                setSelectedContactsAll(true);
                            }
                        }}
                    />
                    <span>Select All</span>
                </Box>
                <MapWithCount
                    isMapUILoading={isMapUILoading}
                    setIsMapUILoading={setIsMapUILoading}
                    setSelectedAgent={setSelectedAgent}
                    selectedAgent={selectedAgent}
                />
            </Grid>
        </Grid>
    );
}

export default ContactsMap;
