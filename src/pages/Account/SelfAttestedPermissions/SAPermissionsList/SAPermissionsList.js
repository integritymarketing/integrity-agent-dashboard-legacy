import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import useLoadMore from "pages/Account/SelfAttestedPermissions/hooks/useLoadMore";
import { LoadMoreButton } from "../LoadMoreButton";
import { ListItem } from "./ListItem";
import { SAAddPermissionForm } from "../SAAddPermissionForm";

import styles from "./styles.module.scss";

const ITEM_PER_PAGE = 5;

function SAPermissionsList({
  data = [],
  agents,
  isAdding,
  handleAddNew,
  handleCancel,
  fetchTableData,
}) {
  const { visibleItems, loadMore, hasMore } = useLoadMore(data, ITEM_PER_PAGE);

  return (
    <Box className={styles.container}>
      <SAAddPermissionForm
        isAdding={isAdding}
        handleCancel={handleCancel}
        handleAddNew={handleAddNew}
        agents={agents}
        fetchTableData={fetchTableData}
      />
      {visibleItems.map((item, index) => (
        <ListItem item={item} key={index} fetchTableData={fetchTableData} />
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
  fetchTableData: PropTypes.func,
};

export default SAPermissionsList;
