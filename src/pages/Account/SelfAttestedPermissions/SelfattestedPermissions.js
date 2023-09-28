import Container from "components/ui/container";

import { SAPermissionsList } from "./SAPermissionsList";
import { SAPermissionsHeader } from "./SAPermissionsHeader";
import { SAPermissionsTable } from "./SAPermissionsTable";
import { SAAddPermissionRow } from "./SAAddPermissionRow";
import { useWindowSize } from "hooks/useWindowSize";
import SAExpiredModal from "./SAPermissionModal/ExpiredModal";
import SAInfoModal from "./SAPermissionModal/InfoModal";
import ErrorModal from "./SAPermissionModal/ErrorModal";

import { SAPermissionsProvider } from "./providers/SAPermissionProvider";
import { SAPModalProvider } from "./providers/SAPModalProvider";

import styles from "./styles.module.scss";

function SelfAttestedPermissions() {
  const { width: windowWidth } = useWindowSize();

  const isMobile = windowWidth <= 784;

  return (
    <SAPModalProvider>
      <SAPermissionsProvider>
        <Container className={styles.container}>
          <SAPermissionsHeader />
          {!isMobile && <SAPermissionsTable />}
          {isMobile && <SAPermissionsList />}
          {<SAAddPermissionRow />}
        </Container>
      </SAPermissionsProvider>
      <SAExpiredModal />
      <SAInfoModal />
      <ErrorModal />
    </SAPModalProvider>
  );
}

export default SelfAttestedPermissions;
