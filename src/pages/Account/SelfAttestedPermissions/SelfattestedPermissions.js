import { useState, useCallback } from "react";
import Container from "components/ui/container";
import makeStyles from "@mui/styles/makeStyles";

import useFetchAgentsData from "./hooks/useFetchAgentsData";
import Spinner from "components/ui/Spinner/index";
import { SAPermissionsHeader } from "./SAPermissionsHeader";
import { SAPermissionsTable } from "./SAPermissionsTable";
import { SAPermissionModal } from "./SAPermissionModal";
import { SAAddPermissionRow } from "./SAAddPermissionRow";
import useFeatureFlag from "hooks/useFeatureFlag";

const FLAG_NAME = 'REACT_APP_SELF_ATTESTED_PERMISSION_FLAG'

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "60px",
    padding: "0 24px",
  },
}));

function SelfAttestedPermissions() {
  const styles = useStyles();
  const [isAdding, setIsAdding] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, agents, tableData } = useFetchAgentsData();
  const isFeatureEnabled = useFeatureFlag(FLAG_NAME)

  const handleAddNew = useCallback(() => {
    setIsAdding(true);
  }, [setIsAdding]);

  const handleCancel = useCallback(() => {
    setIsAdding(false);
  }, [setIsAdding]);

  if(!isFeatureEnabled) return <></>

  if (isLoading) return <Spinner />;

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
        {!isCollapsed && (
          <SAPermissionsTable
            isAdding={isAdding}
            agents={agents}
            data={tableData}
            handleCancel={handleCancel}
            handleAddNew={handleAddNew}
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
