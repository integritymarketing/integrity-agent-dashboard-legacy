import Container from "components/ui/container";

import { HEALTH, LIFE, useAccountProductsContext } from "pages/Account/providers/AccountProductsProvider";

import { SAHealthProduct } from "./SAHealthProduct";
import { SALifeProduct } from "./SALifeProduct";
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
                {layout === LIFE && <SALifeProduct />}
            </Container>
        </SAPermissionsProvider>
    );
}

export default SelfAttestedPermissions;
