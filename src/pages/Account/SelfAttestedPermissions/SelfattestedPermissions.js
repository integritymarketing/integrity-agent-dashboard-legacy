import { useState, useCallback } from "react";
import Container from "components/ui/container";

import Spinner from "components/ui/Spinner/index";
import { SAPermissionsList } from "./SAPermissionsList";
import { SAPermissionsHeader } from "./SAPermissionsHeader";
import { SAPermissionsTable } from "./SAPermissionsTable";
import { SAPermissionModal } from "./SAPermissionModal";
import { SAAddPermissionRow } from "./SAAddPermissionRow";
import useFeatureFlag from "hooks/useFeatureFlag";
import { useWindowSize } from "hooks/useWindowSize";
import useFetchTableData from "./hooks/useFetchTableData";
import useFetchAgentsData from "./hooks/useFetchAgentsData";

import styles from "./styles.module.scss";

const FLAG_NAME = "REACT_APP_SELF_ATTESTED_PERMISSION_FLAG";

function SelfAttestedPermissions() {
  const [isAdding, setIsAdding] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { agents, isLoading } = useFetchAgentsData();
  const {
    tableData,
    isLoading: isfetchingTableData,
    fetchTableData,
  } = useFetchTableData();
  const { width: windowWidth } = useWindowSize();
  const isFeatureEnabled = useFeatureFlag(FLAG_NAME);

  const isMobile = windowWidth <= 784;

  const handleAddNew = useCallback(() => {
    setIsAdding(true);
  }, [setIsAdding]);

  const handleCancel = useCallback(() => {
    setIsAdding(false);
  }, [setIsAdding]);

  if (!isFeatureEnabled) return <></>;

  if (isLoading || isfetchingTableData) return <Spinner />;

  return (
    <>
      <Container className={styles.container}>
        <SAPermissionsHeader
          handleAddNew={handleAddNew}
          setIsModalOpen={setIsModalOpen}
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
          isAdding={isAdding}
          numOfPermissions={tableData.length}
        />
        {!isCollapsed && !isMobile && (
          <SAPermissionsTable
            isAdding={isAdding}
            agents={agents}
            data={tableData}
            handleCancel={handleCancel}
            fetchTableData={fetchTableData}
          />
        )}
        {!isCollapsed && isMobile && (
          <SAPermissionsList
            isAdding={isAdding}
            agents={agents}
            data={tableData}
            handleCancel={handleCancel}
            fetchTableData={fetchTableData}
          />
        )}
        {!isCollapsed && (
          <SAAddPermissionRow
            isAdding={isAdding}
            handleAddNew={handleAddNew}
            numOfPermissions={tableData.length}
          />
        )}
      </Container>
      <SAPermissionModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default SelfAttestedPermissions;
