import Container from "components/ui/container";

import { HEALTH, LIFE, useAccountProductsContext } from "pages/Account/providers/AccountProductsProvider";

import { ActivePermissionsHeader } from "./ActivePermissionsHeader";
import { ActivePermissionsHealth } from "./ActivePermissionsHealth";
import { ActivePermissionsLayout } from "./ActivePermissionsLayout";
import { ActivePermissionLife } from "./ActivePermissionsLife";
import { ActivePermissionsProvider } from "./providers/ActivePermissionsProvider";
import styles from "./styles.module.scss";

function ActivePermissions() {
    const { layout } = useAccountProductsContext();

    return (
        <ActivePermissionsProvider>
            <Container className={styles.container}>
                <ActivePermissionsHeader />
                <ActivePermissionsLayout />
                {layout === HEALTH && <ActivePermissionsHealth />}
                {layout === LIFE && <ActivePermissionLife />}
            </Container>
        </ActivePermissionsProvider>
    );
}

export default ActivePermissions;
