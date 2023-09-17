import { useState, useEffect, useCallback } from "react";
import Container from "components/ui/container";
import makeStyles from "@mui/styles/makeStyles";

import { SAPermissionsHeader } from "./SAPermissionsHeader";
import { SAPermissionsTable } from "./SAPermissionsTable";
import { SAPermissionModal } from "./SAPermissionModal";

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "60px",
    padding: "0 24px",
  },
}));

function SelfAttestedPermissions() {
  const styles = useStyles();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddNew = useCallback(() => {
    console.log("Add new");
  }, []);

  return (
    <>
      <Container className={styles.container}>
        <SAPermissionsHeader
          handleAddNew={handleAddNew}
          setIsModalOpen={setIsModalOpen}
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
        />
        {!isCollapsed && <SAPermissionsTable />}
      </Container>
      <SAPermissionModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default SelfAttestedPermissions;
