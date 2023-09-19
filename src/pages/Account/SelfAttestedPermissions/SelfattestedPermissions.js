import { useState, useCallback } from "react";
import Container from "components/ui/container";
import makeStyles from "@mui/styles/makeStyles";

import { SAPermissionsHeader } from "./SAPermissionsHeader";
import { SAPermissionsTable } from "./SAPermissionsTable";
import { SAPermissionModal } from "./SAPermissionModal";
import { SAAddPermissionRow } from "./SAAddPermissionRow";

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "60px",
    padding: "0 24px",
  },
}));

const MOCK_DATA = [
  {
    carrier: "Humana",
    product: "MA",
    state: "TX",
    planYear: "2023",
    producerId: 123321,
    dateAdded: "12/12/2023",
  },
  {
    carrier: "Humana 1",
    product: "CA",
    state: "TX",
    planYear: "2023",
    producerId: 123321,
    dateAdded: "12/12/2023",
  },
];

function SelfAttestedPermissions() {
  const styles = useStyles();
  const [isAdding, setIsAdding] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddNew = useCallback(() => {
    setIsAdding(true);
  }, [setIsAdding]);

  const handleCancel = useCallback(() => {
    setIsAdding(false);
  }, [setIsAdding]);

  return (
    <>
      <Container className={styles.container}>
        <SAPermissionsHeader
          handleAddNew={handleAddNew}
          setIsModalOpen={setIsModalOpen}
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
          isAdding={isAdding}
        />
        {!isCollapsed && (
          <>
            <SAPermissionsTable
              isAdding={isAdding}
              data={MOCK_DATA}
              handleCancel={handleCancel}
              handleAddNew={handleAddNew}
            />
            <SAAddPermissionRow
              isAdding={isAdding}
              handleAddNew={handleAddNew}
            />
          </>
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
