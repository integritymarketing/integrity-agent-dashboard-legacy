import state from "./state";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import clientsService from "services/clientsService";
import useToast from "hooks/useToast";
import * as Sentry from "@sentry/react";

const useActivities = ({getLeadDetails}) => {
  const addToast = useToast();
  const { contactId: leadsId } = useParams();

  const activities = useRecoilValue(
    state.selectors.contactLeadActivitiesSelector
  )[0];
  const leadFullName = useRecoilValue(
    state.selectors.contactLeadActivitiesSelector
  )[1];
  const [open, setOpen] = useRecoilState(state.atoms.addNewActivitiesAtom);

  const pageHasMoreRows = useRecoilValue(
    state.selectors.pageHasMoreRowsSelector
  );
  const filterValues = useRecoilValue(state.selectors.filterValuesSelector)
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

  const onChangeFilters = useCallback((filters) => {
    setActivitiesFilters(Object.fromEntries(filters.map(filter => [filter.name, filter.selected])))
  }, [setActivitiesFilters])

  const onShowMore = useCallback(() => {
    setActivitiesPageLimit(({ initial, size }) => ({ initial, size: size + initial }));
  }, [setActivitiesPageLimit])

  const handleAddNewActivity = useCallback(async(activitySubject, activityBody) => {
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
        Sentry.captureException(e);
        setOpen(false);
      });
  }, [getLeadDetails, addToast, leadsId, setOpen]);

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
    activitiesPageLimit
  };
};

export default useActivities;
