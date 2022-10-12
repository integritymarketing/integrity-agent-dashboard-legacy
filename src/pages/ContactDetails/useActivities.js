import state from "./state";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import clientsService from "services/clientsService";
import useToast from "hooks/useToast";
import * as Sentry from "@sentry/react";

const isCustomActivity = (row) =>
  row.activityId && row.activityTypeName === "Note";

const useActivities = ({ getLeadDetails }) => {
  const addToast = useToast();
  const { contactId: leadsId } = useParams();
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

  const onShowMore = useCallback(() => {
    setActivitiesPageLimit(({ initial, size }) => ({
      initial,
      size: size + initial,
    }));
  }, [setActivitiesPageLimit]);

  const addErrorToast = useCallback(
    (message) => {
      addToast({
        type: "error",
        message: message,
        time: 3000,
      });
    },
    [addToast]
  );

  const handleAddNewActivity = useCallback(
    async (activitySubject, activityBody) => {
      const payload = {
        activityBody,
        activitySubject,
        leadsId,
        activityTypeId: 0,
      };
      await clientsService
        .createActivity(payload)
        .then(async () => {
          addToast({
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
    [getLeadDetails, addToast, leadsId, setOpen, addErrorToast]
  );

  const handleDeleteActivity = useCallback(
    async (activity) => {
      try {
        await clientsService.deleteActivity(activity?.activityId);
        getLeadDetails();
        addToast({
          type: "success",
          message: "Activity successfully deleted",
          time: 3000,
        });
      } catch (e) {
        Sentry.captureException(e);
        addErrorToast("There was an error while deleting your activity");
      }
    },
    [getLeadDetails, addToast, addErrorToast]
  );

  const handleEditActivity = useCallback(
    async (activityId, activitySubject, activityBody) => {
      const payload = {
        activityBody,
        activitySubject,
        activityId,
      };
      try {
        await clientsService.updateActivity(payload, leadsId);
        getLeadDetails();
        setEditActivity(null);
        addToast({
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
    [getLeadDetails, leadsId, addToast, addErrorToast, setSelectedActivity]
  );

  const handleAddActivtyNotes = useCallback(
    async (activity, activityNote) => {
      const { activityBody, activitySubject, activityId } = activity;
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
        addToast({
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
    [getLeadDetails, setSelectedActivity, addToast, leadsId, addErrorToast]
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
  };
};

export default useActivities;
