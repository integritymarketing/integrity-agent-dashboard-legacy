import Container from "components/ui/container";

import { SAPermissionsList } from "./SAPermissionsList";
import { SAPermissionsHeader } from "./SAPermissionsHeader";
import { SAPermissionsTable } from "./SAPermissionsTable";
import { SAPermissionModal } from "./SAPermissionModal";
import { SAAddPermissionRow } from "./SAAddPermissionRow";
import { useWindowSize } from "hooks/useWindowSize";

import { SAPermissionsProvider } from "./SAPermissionProvider";

import styles from "./styles.module.scss";

function SelfAttestedPermissions() {
  const { width: windowWidth } = useWindowSize();

  const isMobile = windowWidth <= 784;

  return (
    <SAPermissionsProvider>
      <Container className={styles.container}>
        <SAPermissionsHeader />
        {!isMobile && <SAPermissionsTable />}
        {isMobile && <SAPermissionsList />}
        {<SAAddPermissionRow />}
      </Container>
      <SAPermissionModal />
    </SAPermissionsProvider>
  );
}

export default SelfAttestedPermissions;
