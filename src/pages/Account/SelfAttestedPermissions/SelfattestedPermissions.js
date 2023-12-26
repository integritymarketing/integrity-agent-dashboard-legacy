import Container from "components/ui/container";

import { SAHealthProduct } from "./SAHealthProduct";
import { SAPermissionsHeader } from "./SAPermissionsHeader";
import { SAPermissionsLayout } from "./SAPermissionsLayout";
import { SAPermissionsProvider } from "./providers/SAPermissionProvider";
import styles from "./styles.module.scss";

function SelfAttestedPermissions() {
    return (
        <SAPermissionsProvider>
            <Container className={styles.container}>
                <SAPermissionsHeader />
                <SAPermissionsLayout />
                <SAHealthProduct />
            </Container>
        </SAPermissionsProvider>
    );
}

export default SelfAttestedPermissions;
