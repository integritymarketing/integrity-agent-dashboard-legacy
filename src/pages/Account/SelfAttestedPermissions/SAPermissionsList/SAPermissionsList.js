import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import useLoadMore from "pages/Account/SelfAttestedPermissions/hooks/useLoadMore";
import { LoadMoreButton } from "../SAPermissionsTable/LoadMoreButton";

import { ListItem } from "./ListItem";

import styles from "./styles.module.scss";

const ITEM_PER_PAGE = 5;

function SAPermissionsList({
  data = [],
  agents,
  isAdding,
  handleAddNew,
  handleCancel,
}) {
  const { visibleItems, loadMore, hasMore } = useLoadMore(data, ITEM_PER_PAGE);

  return (
    <Box className={styles.container}>
      {visibleItems.map((item, index) => (
        <ListItem item={item} key={index} />
      ))}
      {hasMore && <LoadMoreButton loadMore={loadMore} />}
    </Box>
  );
}

SAPermissionsList.propTypes = {
  data: PropTypes.array,
  agents: PropTypes.array,
  handleAddNew: PropTypes.func,
  handleCancel: PropTypes.func,
  isAdding: PropTypes.bool,
};

export default SAPermissionsList;
