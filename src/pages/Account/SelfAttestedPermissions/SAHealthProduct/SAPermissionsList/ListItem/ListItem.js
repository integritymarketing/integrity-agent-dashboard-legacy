import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
 
import { dateFormatter } from "utils/dateFormatter";
import { DeleteButton } from "../../DeleteButton";
import InfoRedIcon from "components/icons/info-red";
import { useSAPModalsContext } from "../../providers/SAPModalProvider";
 
import styles from "./styles.module.scss";
 
function ListItem({ item }) {
  const { setIsExpriedModalOpen } = useSAPModalsContext();
  const isExpired = item.isExpired;
 
  return (
    <Grid
      className={styles.container}
      display="flex"
      justifyContent="space-between"
    >
      <Grid>
        <Box className={styles.section}>
          <Box className={styles.label}>
            <Box className={isExpired && styles.expiredTitle}>Carrier:</Box>
          </Box>
          <Box className={isExpired && styles.expired}>{item.carrier}</Box>
        </Box>
        <Box className={styles.section}>
          <Box className={styles.label}>
            <Box className={isExpired && styles.expiredTitle}>Product:</Box>
          </Box>
          <Box className={styles.pill}>
            <Box className={isExpired && styles.expired}>{item.product}</Box>
          </Box>
        </Box>
        <Box className={styles.section}>
          <Box className={styles.label}>
            <Box className={isExpired && styles.expiredTitle}>State:</Box>
          </Box>
          <Box className={isExpired && styles.expired}>{item.state}</Box>
        </Box>
        <Box className={styles.section}>
          <Box className={styles.label} display="inline">
            <Box className={isExpired && styles.expiredTitle}>Added: 
              <span className={isExpired && styles.expired}>
                    {` ${dateFormatter(item.createDate, "M-DD-YY")}`}
              </span>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Box>
            <Box className={styles.label} display="inline">
              <Box className={isExpired && styles.expiredTitle}>Year:
                <span className={isExpired && styles.expired}>
                  {` ${item.planYear}`}
                </span></Box>
            </Box>
          </Box>
          <Box>
            <Box className={styles.label} display="inline">
              <Box className={isExpired && styles.expiredTitle}>ID:
                <span className={isExpired && styles.expired}>
                  {` ${item.awn}`}
                </span>
              </Box>
            </Box>
 
          </Box>
        </Box>
        <Box>
          {isExpired && (
            <Box className={styles.expiredColumn}>
              <Box className={styles.expiredIcon} onClick={() => setIsExpriedModalOpen(true)}>
                <InfoRedIcon />
              </Box>
              <Box>Expired</Box>
            </Box>
          )}
          <DeleteButton attestationId={item.attestationId} />
        </Box>
      </Grid>
    </Grid>
  );
}
 
ListItem.propTypes = {
  item: PropTypes.object,
};
 
export default ListItem;
 