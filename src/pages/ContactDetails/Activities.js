import React, { useState } from "react";
import useActivities from "./useActivities";
import ActivitiesTable from "./ActivitiesTable";
import Filter from "packages/Filter/Filter";
import FilterOptions from "packages/Filter/FilterOptions";
import styles from "./Activities.module.scss";
import AddNewActivityDialog from "./AddNewActivityDialog";
import EditActivityDialog from "./EditActivityDialog";
import ActivityDetails from "./ActivityDetails";
import FilterIcon from "components/icons/activities/Filter";
import ActiveFilter from "components/icons/activities/ActiveFilter";
import Media from "react-media";
import Plus from "components/icons/plus";
import { Button } from "components/ui/Button";
import ContactSectionCard from "packages/ContactSectionCard";
import { useLeadDetails } from "providers/ContactDetails";

const Activities = ({ leadId }) => {
    const [isMobile, setIsMobile] = useState(false);
    const { getLeadDetails } = useLeadDetails();

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
        activitiesLength,
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

                <Button
                    icon={<Plus />}
                    iconPosition="right"
                    label="Add New"
                    onClick={() => {
                        setOpen(true);
                    }}
                    type="tertiary"
                    className={styles.buttonWithIcon}
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
            </div>
        );
    };

    return (
        <div className={styles.layout}>
            <div className={styles.activities}>
                {/* <SectionHeader text={"Activities"} children={sectionHeaderChildren()} /> */}

                <ContactSectionCard
                    title="Activities"
                    infoIcon={`(${activitiesLength})`}
                    className={styles.activitiesContainer}
                    contentClassName={styles.activitiesContainer_content}
                    actions={<div className="actions">{sectionHeaderChildren()}</div>}
                >
                    <ActivitiesTable
                        data={activities}
                        onActivityClick={onActivityClick}
                        onShowMore={onShowMore}
                        pageHasMoreRows={pageHasMoreRows}
                        leadId={leadId}
                        handleDeleteActivity={handleDeleteActivity}
                        setEditActivity={setEditActivity}
                        isMobile={isMobile}
                    />
                </ContactSectionCard>

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
                        setDisplay={setDisplay}
                    />
                )}
            </div>
        </div>
    );
};

export default Activities;
