import { atom, selector } from "recoil";

const contactLeadIdAtom = atom({
  default: null,
  key: "contactLeadId",
});

const contactLeadDetailsAtom = atom({
  default: [],
  key: "contactLeadDetails",
});

const activitiesSortingByDateAtom = atom({
  default: {
    column: "createDate",
    order: "desc",
  },
  key: "contactLeadSorting",
});

const activitiesPageLimitAtom = atom({
  default: {
    initial: 6,
    size: 6,
  },
  key: "activitiesPageLimit",
});

const activitiesFiltersAtom = atom({
  default: {},
  key: "activitiesFilters",
});

const addNewActivitiesAtom = atom({
  default: false,
  key: "addNewActivities",
});

const filterValuesSelector = selector({
  key: "filterValuesSelector",
  get: ({ get }) => {
    const contactDetails = get(contactLeadDetailsAtom);
    const filters = get(activitiesFiltersAtom);
    const activities = (contactDetails?.activities ?? []).map((rec) => ({
      ...rec,
      createDate: new Date(rec.createDate),
    }));
    return [
      ...new Set(
        activities.map((activity) => {
          return activity.activitySubject;
        })
      ),
    ].map((name) => {
      return { name, selected: Boolean(filters[name]) };
    });
  },
});

const contactLeadActivitiesSelector = selector({
  key: 'contactLeadActivitiesSelector',
  get: ({ get }) => {
    const contactDetails = get(contactLeadDetailsAtom);
    const sorting = get(activitiesSortingByDateAtom);
    const {size: pageLimit} = get(activitiesPageLimitAtom);
    const filters = get(activitiesFiltersAtom);

    const applyFilter = Object.keys(filters || {}).filter(filter => filters[filter]).length > 0;

    const activities = (contactDetails?.activities ?? []).map((rec) => ({
      ...rec,
      createDate: new Date(rec.createDate),
    }));

    const leadFullName = `${contactDetails.firstName} ${contactDetails.lastName}`;

    const filteredActivities = activities.filter((rec) => {
      if (applyFilter) {
        return Boolean(filters[rec.activitySubject]);
      }
      return true;
    });

    const sortedActivities = filteredActivities.sort((a, b) => {
      return sorting.order === "desc"
        ? b[sorting.column] - a[sorting.column]
        : a[sorting.column] - b[sorting.column];
    });
    return [sortedActivities.splice(0, pageLimit), leadFullName];
  },
});

const pageHasMoreRowsSelector = selector({
  key: 'activitieageHasMoreRows',
  get: ({ get }) => {
    const {size} = get(activitiesPageLimitAtom);
    const contactDetails = get(contactLeadDetailsAtom);
    const noOfActivities = contactDetails?.activities?.length ?? 0
    return size < noOfActivities;
  }
})

const state = {
  atoms: {
    contactLeadIdAtom,
    contactLeadDetailsAtom,
    activitiesFiltersAtom,
    activitiesSortingByDateAtom,
    activitiesPageLimitAtom,
    addNewActivitiesAtom,
  },
  selectors: {
    contactLeadActivitiesSelector,
    filterValuesSelector,
    pageHasMoreRowsSelector
  },
};

export default state;
