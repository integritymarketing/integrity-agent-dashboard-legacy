import React, { useState } from "react";
import useActivities from "./useActivities";
import ActivitiesTable from "./ActivitiesTable";
import { TextButton } from "packages/Button";
import SectionHeader from "packages/SectionHeader";
import { Divider } from "@mui/material";
import Filter from "packages/Filter/Filter";
import FilterOptions from "packages/Filter/FilterOptions";
import styles from "./Activities.module.scss";
import AddNew from "components/icons/addnew";
import AddNewActivityDialog from "./AddNewActivityDialog";
import FooterBanners from "packages/FooterBanners";
import ActivityDetails from "./ActivityDetails";

const Activities = ({ getLeadDetails }) => {
  const {
    activities,
    filterValues,
    leadFullName,
    onChangeFilters,
    onShowMore,
    pageHasMoreRows,
    open,
    setOpen,
    handleAddNewActivity,
  } = useActivities({ getLeadDetails });
  const [selectedActivity, setSelectedActivity] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const onActivityClick = (activity) => {
    setSelectedActivity(activity);
    handleModalOpen();
  };

  const onActivitySave = (scope, note) => {
    handleModalClose();
  };

  const sectionHeaderChildren = () => {
    return (
      <div className={styles.wrapper}>
        <Filter
          heading={"Filter by Activity Type"}
          content={
            <FilterOptions
              values={filterValues}
              multiSelect={true}
              onApply={onChangeFilters}
            />
          }
        />
        <TextButton
          endIcon={<AddNew />}
          onClick={() => {
            setOpen(true);
          }}
        >
          Add new
        </TextButton>
      </div>
    );
  };

  return (
    <div className={styles.layout}>
      <div className={styles.activities}>
        <SectionHeader text={"Activity"} children={sectionHeaderChildren()} />
        <Divider />
        <ActivitiesTable
          data={activities}
          onActivityClick={onActivityClick}
          onShowMore={onShowMore}
          pageHasMoreRows={pageHasMoreRows}
        />

        <AddNewActivityDialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          onSave={handleAddNewActivity}
        />
        <ActivityDetails
          open={modalOpen}
          onSave={onActivitySave}
          onClose={handleModalClose}
          leadFullName={leadFullName}
          activityObj={selectedActivity ? selectedActivity : {}}
        />
      </div>
      <FooterBanners className={styles.footerBanners} />
    </div>
  );
};

export default Activities;
