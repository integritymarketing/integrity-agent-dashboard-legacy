import Box from "@mui/material/Box";

import useLoadMore from "pages/Account/SelfAttestedPermissions/hooks/useLoadMore";
import { LoadMoreButton } from "../LoadMoreButton";
import { ListItem } from "./ListItem";
import { SAAddPermissionForm } from "../SAAddPermissionForm";
import { useSAPermissionsContext } from "../providers/SAPermissionProvider";

import styles from "./styles.module.scss";

const ITEM_PER_PAGE = 5;

function SAPermissionsList() {
  const { filteredData, isCollapsed } = useSAPermissionsContext();
  const { visibleItems, loadMore, hasMore } = useLoadMore(
    filteredData,
    ITEM_PER_PAGE
  );

  if (isCollapsed) return <></>;

  return (
    <Box className={styles.container}>
      <SAAddPermissionForm />
      {visibleItems.map((item, index) => (
        <ListItem item={item} key={index} />
      ))}
      {hasMore && <LoadMoreButton loadMore={loadMore} />}
    </Box>
  );
}

export default SAPermissionsList;
