import useRoles from "hooks/useRoles";

import NonRTSBanner from "components/Non-RTS-Banner";
import Container from "components/ui/container";

import { ActivePermissionsHeader } from "./ActivePermissionsHeader";
import { ActivePermissionsHealth } from "./ActivePermissionsHealth";
import { ActivePermissionsLayout } from "./ActivePermissionsLayout";
import { ActivePermissionsProvider } from "./providers/ActivePermissionsProvider";
import styles from "./styles.module.scss";

function ActivePermissions() {
    const { isNonRTS_User } = useRoles();

    return (
        <ActivePermissionsProvider>
            <Container className={styles.container}>
                <ActivePermissionsHeader />
                {isNonRTS_User && <NonRTSBanner />}
                {!isNonRTS_User && (
                    <>
                        <ActivePermissionsLayout />
                        <ActivePermissionsHealth />
                    </>
                )}
            </Container>
        </ActivePermissionsProvider>
    );
}

export default ActivePermissions;
