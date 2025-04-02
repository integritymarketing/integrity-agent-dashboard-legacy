import { Divider, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import styles from './styles.module.scss';
import { Checkbox } from 'components/ui/version-2/Checkbox';
import { ContactsCard } from '../ContactsCard';
import MapWithCount from 'components/MapWithCount';
import { useContactsListContext } from '../providers/ContactsListProvider';
import { useContactListAPI } from 'providers/ContactListAPIProviders';
import { useState } from 'react';
import SelectedAgentCard from './SelectedAgentCard/SelectedAgentCard';
import ContactsListErrorMessage from '../ContactsListErrorMessage';

function ContactsMap() {
  const { setSelectAllContacts, tableData, selectedContacts } =
    useContactsListContext();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isMapUILoading, setIsMapUILoading] = useState(true);
  const { errorCode } = useContactListAPI();

  return (
    <Grid container className={styles.container} spacing={1}>
      {errorCode ? (
        <Grid item xs={12} sm={12} md={12}>
          <ContactsListErrorMessage errorCode={errorCode} />
        </Grid>
      ) : (
        <>
          <Grid className={styles.clientsColumn} item xs={0} md={5}>
            <h2 className={styles.clientHeader}>Clients</h2>
            <Divider className={styles.clientsDivider} />
            {selectedAgent ? (
              <Box className={styles.clientsCardsContainer}>
                <SelectedAgentCard
                  setSelectedAgent={setSelectedAgent}
                  selectedAgent={selectedAgent}
                />
              </Box>
            ) : (
              <Box className={styles.clientsCardsContainer}>
                <Checkbox
                  checked={tableData.length == selectedContacts.length}
                  onChange={event => {
                    setSelectAllContacts(event.target.checked);
                  }}
                />
                <span>Select All</span>
                <ContactsCard
                  isMapPage={true}
                  cardWrapperClassName={styles.cardWrapperClassName}
                />
              </Box>
            )}
          </Grid>
          <Grid className={styles.mapColumn} item xs={12} md={7}>
            <MapWithCount
              isMapUILoading={isMapUILoading}
              setIsMapUILoading={setIsMapUILoading}
              setSelectedAgent={setSelectedAgent}
              selectedAgent={selectedAgent}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default ContactsMap;
