import Box from "@mui/material/Box";

import useLoadMore from "pages/Account/SelfAttestedPermissions/hooks/useLoadMore";

import { ErrorBanner } from "pages/Account/SelfAttestedPermissions/ErrorBanner";
import { useSAHealthProductContext } from "pages/Account/SelfAttestedPermissions/SAHealthProduct/providers/SAHealthProductProvider";

import { ListItem } from "./ListItem";
import styles from "./styles.module.scss";

import { LoadMoreButton } from "../LoadMoreButton";
import { SAAddPermissionForm } from "../SAAddPermissionForm";

const ITEM_PER_PAGE = 5;

function SAPermissionsList() {
    const { filteredData, error, setError } = useSAHealthProductContext();
    const { visibleItems, loadMore, hasMore } = useLoadMore(filteredData, ITEM_PER_PAGE);

    return (
        <Box className={styles.container}>
            {error && <ErrorBanner retry={() => setError(null)} />}
            {!error && (
                <>
                    <SAAddPermissionForm />
                    {visibleItems.map((item, index) => (
                        <ListItem item={item} key={index} />
                    ))}
                    {hasMore && <LoadMoreButton loadMore={loadMore} />}
                </>
            )}
        </Box>
    );
}

export default SAPermissionsList;
