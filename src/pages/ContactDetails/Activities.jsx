import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import Media from "react-media";
import { Button } from "components/ui/Button";
import PlusIcon from "components/icons/plus";
import FilterIcon from "components/icons/activities/Filter";
import ActiveFilterIcon from "components/icons/activities/ActiveFilter";
import ActivitiesTable from "./ActivitiesTable";
import AddNewActivityDialog from "./AddNewActivityDialog";
import EditActivityDialog from "./EditActivityDialog";
import ActivityDetails from "./ActivityDetails";
import Filter from "packages/Filter/Filter";
import FilterOptions from "packages/Filter/FilterOptions";
import ContactSectionCard from "packages/ContactSectionCard";
import { useOverView, useLeadDetails } from "providers/ContactDetails";
import styles from "./Activities.module.scss";
import WithLoader from "components/ui/WithLoader";

const Activities = ({ leadId }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedEditActivity, setSelectedEditActivity] = useState(null);
    const [isAddActivityDialogOpen, setAddActivityDialogOpen] = useState(false);
    const [filterValues, setFilterValues] = useState([]);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [activitiesFilters, setActivitiesFilters] = useState({});
    const [activitiesPageLimit, setActivitiesPageLimit] = useState({ initial: 6, size: 6 });
    const [sortingOptions, setSortingOptions] = useState({ sortBy: "createDate", order: "desc" });

    const { addActivity, editActivity, removeActivity, addActivityNotes, isLoadingActivities } = useOverView();
    const { leadDetails } = useLeadDetails();

    const leadFullName = useMemo(() => {
        const { firstName = "", lastName = "" } = leadDetails;
        return `${firstName} ${lastName}`;
    }, [leadDetails]);

    useEffect(() => {
        const formattedActivities = (leadDetails?.activities ?? []).map((activity) => ({
            ...activity,
            createDate: new Date(activity.createDate),
        }));

        setFilterValues(
            [...new Set(formattedActivities.map((activity) => activity.activitySubject))].map((name) => {
                const activity = formattedActivities.find((act) => act.activitySubject === name);
                return {
                    name,
                    selected: Boolean(activitiesFilters[name]),
                    icon: activity?.activityIconUrl,
                };
            })
        );
    }, [leadDetails, activitiesFilters]);

    const sortActivities = useCallback(
        (activities, sortingOptions) => {
            const { sortBy, order } = sortingOptions;
            let sortedActivities = [];

            if (sortBy === "createDate") {
                sortedActivities = activities?.sort((a, b) => {
                    return order === "desc"
                        ? new Date(b.createDate) - new Date(a.createDate)
                        : new Date(a.createDate) - new Date(b.createDate);
                });
            }

            if (sortBy === "activitySubject") {
                sortedActivities = activities?.sort((a, b) => {
                    return order === "desc"
                        ? b?.activitySubject?.localeCompare(a?.activitySubject)
                        : a?.activitySubject?.localeCompare(b?.activitySubject);
                });
            }

            return sortedActivities;
        },
        [activitiesFilters]
    );

    const filteredAndSortedActivities = useMemo(() => {
        const applyFilter = Object.keys(activitiesFilters).some((key) => activitiesFilters[key]);
        const filteredActivities = applyFilter
            ? leadDetails?.activities?.filter((activity) => activitiesFilters[activity.activitySubject])
            : leadDetails?.activities;

        const sortedActivities = sortActivities(filteredActivities, sortingOptions);

        return sortedActivities?.slice(0, activitiesPageLimit.size);
    }, [leadDetails.activities, activitiesFilters, activitiesPageLimit, sortingOptions]);

    const handleFilterChange = useCallback(
        (filters) => {
            setActivitiesFilters(Object.fromEntries(filters.map((filter) => [filter.name, filter.selected])));
            setIsFilterMenuOpen(false);
        },
        [setActivitiesFilters, setIsFilterMenuOpen]
    );

    const resetFilter = useCallback(() => {
        setActivitiesFilters({});
        setActivitiesPageLimit((prev) => ({ ...prev, size: prev.initial }));
    }, []);

    const showMoreActivities = useCallback(() => {
        setActivitiesPageLimit((prev) => ({ ...prev, size: prev.size + prev.initial }));
    }, []);

    const ACTIVE_FILTER = filterValues?.filter((item) => item.selected);
    const renderSectionHeader = () => (
        <div className={styles.wrapper}>
            <Media query="(max-width: 500px)" onChange={setIsMobile} />
            <Button
                icon={<PlusIcon />}
                iconPosition="right"
                label="Add New"
                onClick={() => setAddActivityDialogOpen(true)}
                type="tertiary"
                className={styles.buttonWithIcon}
            />
            <div className={styles.filterIcon}>
                <Filter
                    Icon={FilterIcon}
                    ActiveIcon={ActiveFilterIcon}
                    filtered={ACTIVE_FILTER.length > 0 ? true : false}
                    open={isFilterMenuOpen}
                    onToggle={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    heading="Filter by Activity Type"
                    content={
                        <FilterOptions
                            values={filterValues}
                            multiSelect
                            onApply={handleFilterChange}
                            onReset={resetFilter}
                        />
                    }
                />
            </div>
        </div>
    );

    return (
        <WithLoader isLoading={isLoadingActivities}>
            <div className={styles.layout}>
                <div className={styles.activities}>
                    <ContactSectionCard
                        title="Activities"
                        infoIcon={`(${leadDetails.activities?.length})`}
                        className={styles.activitiesContainer}
                        contentClassName={styles.activitiesContainer_content}
                        customStyle={styles.segregator}
                        actions={<div className="actions">{renderSectionHeader()}</div>}
                    >
                        <ActivitiesTable
                            data={filteredAndSortedActivities}
                            onActivityClick={setSelectedActivity}
                            onShowMore={showMoreActivities}
                            pageHasMoreRows={leadDetails?.activities?.length > activitiesPageLimit.size}
                            leadId={leadId}
                            handleDeleteActivity={removeActivity}
                            setEditActivity={setSelectedEditActivity}
                            isMobile={isMobile}
                            setSortingOptions={setSortingOptions}
                        />
                    </ContactSectionCard>

                    {isAddActivityDialogOpen && (
                        <AddNewActivityDialog
                            open={isAddActivityDialogOpen}
                            onClose={() => setAddActivityDialogOpen(false)}
                            leadFullName={leadFullName}
                            onSave={addActivity}
                            leadId={leadId}
                        />
                    )}
                    {selectedEditActivity && (
                        <EditActivityDialog
                            open
                            onClose={() => setSelectedEditActivity(null)}
                            leadFullName={leadFullName}
                            onSave={editActivity}
                            activity={selectedEditActivity}
                            leadId={leadId}
                        />
                    )}
                    {selectedActivity && (
                        <ActivityDetails
                            open
                            onSave={addActivityNotes}
                            onClose={() => setSelectedActivity(null)}
                            leadFullName={leadFullName}
                            activityObj={selectedActivity}
                            leadId={leadId}
                            pageName="Contact Overview"
                        />
                    )}
                </div>
            </div>
        </WithLoader>
    );
};

Activities.propTypes = {
    leadId: PropTypes.number.isRequired,
};

export default Activities;
