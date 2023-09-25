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
import EditActivityDialog from "./EditActivityDialog";
import ActivityDetails from "./ActivityDetails";
import FilterIcon from "components/icons/activities/Filter";
import ActiveFilter from "components/icons/activities/ActiveFilter";
import Media from "react-media";

const Activities = ({ getLeadDetails, leadId, personalInfo, setDisplay }) => {
  const [isMobile, setIsMobile] = useState(false);
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
    isFilterMenuOpen,
    toggleFilterMenu,
    handleDeleteActivity,
    handleEditActivity,
    editActivity,
    setEditActivity,
    selectedActivity,
    setSelectedActivity,
    handleAddActivtyNotes,
    onActivityClick,
    onResetFilter,
  } = useActivities({ getLeadDetails });

  const ACTIVE_FILTER = filterValues.filter((item) => item.selected);

  const sectionHeaderChildren = () => {
    return (
      <div className={styles.wrapper}>
        <Media
          query={"(max-width: 500px)"}
          onChange={(isMobile) => {
            setIsMobile(isMobile);
          }}
        />
        <div className={styles.filterIcon}>
          <Filter
            Icon={FilterIcon}
            ActiveIcon={ActiveFilter}
            filtered={ACTIVE_FILTER.length > 0 ? true : false}
            open={isFilterMenuOpen}
            onToggle={toggleFilterMenu}
            heading={"Filter by Activity Type"}
            content={
              <FilterOptions
                values={filterValues}
                multiSelect={true}
                onApply={onChangeFilters}
                onReset={onResetFilter}
              />
            }
          />
        </div>
        <TextButton
          startIcon={<AddNew />}
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
          leadId={leadId}
          handleDeleteActivity={handleDeleteActivity}
          setEditActivity={setEditActivity}
          isMobile={isMobile}
          personalInfo={personalInfo}
          setDisplay={setDisplay}
        />

        <AddNewActivityDialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          leadFullName={leadFullName}
          onSave={handleAddNewActivity}
        />
        {editActivity && (
          <EditActivityDialog
            open={true}
            onClose={() => {
              setEditActivity(null);
            }}
            leadFullName={leadFullName}
            onSave={handleEditActivity}
            activity={editActivity}
          />
        )}
        {selectedActivity && (
          <ActivityDetails
            open={true}
            onSave={handleAddActivtyNotes}
            onClose={() => setSelectedActivity(null)}
            leadFullName={leadFullName}
            activityObj={selectedActivity}
            leadsId={leadId}
          />
        )}
      </div>
    </div>
  );
};

export default Activities;
