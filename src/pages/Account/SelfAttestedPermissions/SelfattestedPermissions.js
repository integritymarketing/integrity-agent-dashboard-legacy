import Container from "components/ui/container";

import { HEALTH, LIFE, useAccountProductsContext } from "pages/Account/providers/AccountProductsProvider";

import { SAHealthProduct } from "./SAHealthProduct";
import { SAPermissionsHeader } from "./SAPermissionsHeader";
import { SAPermissionsLayout } from "./SAPermissionsLayout";
import { SAPermissionsProvider } from "./providers/SAPermissionProvider";
import styles from "./styles.module.scss";

function SelfAttestedPermissions() {
    const { layout } = useAccountProductsContext();

    return (
        <SAPermissionsProvider>
            <Container className={styles.container}>
                <SAPermissionsHeader />
                <SAPermissionsLayout />
                {layout === HEALTH && <SAHealthProduct />}
                {layout === LIFE && <></>}
            </Container>
        </SAPermissionsProvider>
    );
}

export default SelfAttestedPermissions;
