import state from "./state";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import clientsService from "services/clientsService";
import useToast from "hooks/useToast";
import * as Sentry from "@sentry/react";

const useActivities = ({ getLeadDetails }) => {
  const showToast = useToast();
  const { leadId: leadsId } = useParams();
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [activities, leadFullName] = useRecoilValue(
    state.selectors.contactLeadActivitiesSelector
  );

  const [open, setOpen] = useRecoilState(state.atoms.addNewActivitiesAtom);
  const [editActivity, setEditActivity] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const pageHasMoreRows = useRecoilValue(
    state.selectors.pageHasMoreRowsSelector
  );
  const filterValues = useRecoilValue(state.selectors.filterValuesSelector);
  const [activitiesSortBy, setActivitiesSortBy] = useRecoilState(
    state.atoms.activitiesSortingByDateAtom
  );
  const [activitiesPageLimit, setActivitiesPageLimit] = useRecoilState(
    state.atoms.activitiesPageLimitAtom
  );
  const [activitiesFilters, setActivitiesFilters] = useRecoilState(
    state.atoms.activitiesFiltersAtom
  );

  const toggleActivitiesSortingOrder = useCallback(() => {
    setActivitiesSortBy((sort) => {
      return {
        ...sort,
        order: sort.order === "desc" ? "asc" : "desc",
      };
    });
  }, [setActivitiesSortBy]);

  const onChangeFilters = useCallback(
    (filters) => {
      setActivitiesFilters(
        Object.fromEntries(
          filters.map((filter) => [filter.name, filter.selected])
        )
      );
      setIsFilterMenuOpen(false);
    },
    [setActivitiesFilters, setIsFilterMenuOpen]
  );

  const onResetFilter = useCallback(() => {
    setActivitiesFilters(
      Object.fromEntries(filterValues.map((filter) => [filter.name, false]))
    );

    setActivitiesPageLimit(({ initial, size }) => ({
      initial,
      size: initial,
    }));
  }, [setActivitiesFilters, setActivitiesPageLimit, filterValues]);

  const onShowMore = useCallback(() => {
    setActivitiesPageLimit(({ initial, size }) => ({
      initial,
      size: size + initial,
    }));
  }, [setActivitiesPageLimit]);

  const addErrorToast = useCallback(
    (message) => {
      showToast({
        type: "error",
        message: message,
        time: 3000,
      });
    },
    [showToast]
  );

  const handleAddNewActivity = useCallback(
    async (activitySubject, activityNote) => {
      const payload = {
        activityNote,
        activitySubject,
        leadsId,
        activityTypeId: 0,
      };
      await clientsService
        .createActivity(payload)
        .then(async () => {
          showToast({
            type: "success",
            message: "Activity successfully added.",
            time: 3000,
          });
          await getLeadDetails();
          setOpen(false);
        })
        .catch((e) => {
          setOpen(false);
          Sentry.captureException(e);
          addErrorToast("There was an error while saving your activity");
        });
    },
    [getLeadDetails, showToast, leadsId, setOpen, addErrorToast]
  );

  const handleDeleteActivity = useCallback(
    async (activity) => {
      try {
        await clientsService.deleteActivity(activity?.activityId);
        getLeadDetails();
        showToast({
          type: "success",
          message: "Activity successfully deleted",
          time: 3000,
        });
      } catch (e) {
        Sentry.captureException(e);
        addErrorToast("There was an error while deleting your activity");
      }
    },
    [getLeadDetails, showToast, addErrorToast]
  );

  const handleEditActivity = useCallback(
    async (activityId, activitySubject, activityNote) => {
      const payload = {
        activityNote,
        activitySubject,
        activityId,
      };
      try {
        await clientsService.updateActivity(payload, leadsId);
        getLeadDetails();
        setEditActivity(null);
        showToast({
          type: "success",
          message: "Activity successfully updated.",
          time: 3000,
        });
      } catch (e) {
        setSelectedActivity(null);
        Sentry.captureException(e);
        addErrorToast("There was an error while updating your activity");
      }
    },
    [getLeadDetails, leadsId, showToast, addErrorToast, setSelectedActivity]
  );

  const handleAddActivtyNotes = useCallback(
    async (activity, activityNote) => {
      const { activitySubject, activityBody, activityId } = activity;
      const payload = {
        activityBody,
        activitySubject,
        activityId,
        activityNote,
      };
      try {
        await clientsService.updateActivity(payload, leadsId);
        getLeadDetails();
        setSelectedActivity(null);
        showToast({
          type: "success",
          message: "Activity notes added successfully",
          time: 3000,
        });
      } catch (e) {
        setSelectedActivity(null);
        Sentry.captureException(e);
        addErrorToast("There was an error while updating your activity");
      }
    },
    [getLeadDetails, setSelectedActivity, showToast, leadsId, addErrorToast]
  );

  const toggleFilterMenu = useCallback(() => {
    setIsFilterMenuOpen((isOpen) => !isOpen);
  }, [setIsFilterMenuOpen]);

  const onActivityClick = useCallback(
    (activity) => {
      return setSelectedActivity(activity);
    },
    [setSelectedActivity]
  );

  return {
    activities,
    filterValues,
    pageHasMoreRows,
    open,
    setOpen,
    handleAddNewActivity,
    activitiesSortingOrder: activitiesSortBy.order,
    toggleActivitiesSortingOrder,
    leadFullName,
    activitiesFilters,
    onChangeFilters,
    onShowMore,
    activitiesPageLimit,
    isFilterMenuOpen,
    toggleFilterMenu,
    handleDeleteActivity,
    handleEditActivity,
    editActivity,
    setEditActivity,
    selectedActivity,
    setSelectedActivity,
    onActivityClick,
    handleAddActivtyNotes,
    onResetFilter,
  };
};

export default useActivities;
