import { useState, useEffect, useCallback, useMemo, useContext } from "react";

import useFetchCampaignLeads from "pages/ContactsList/hooks/useFetchCampaignLeads";
import Spinner from "components/ui/Spinner/index";
import StageStatusContext from "contexts/stageStatus";

import ContactListFilterOptionsV2 from "packages/ContactListFilterOptionsV2";

const DEFAULT_SORT = ["createDate:desc"];

export default function CustomContactListFilter({ handleSummaryBarInfo, searchId }) {
    const [filterSectionsConfig, setFilterSectionsConfigState] = useState(
        JSON.parse(sessionStorage.getItem("campaign_contactList_filterSectionsConfig")) || {}
    );

    const [selectedFilterSections, setSelectedFilterSectionsState] = useState(
        JSON.parse(sessionStorage.getItem("campaign_contactList_selectedFilterSections")) || []
    );

    const { statusOptions } = useContext(StageStatusContext);

    const statusOptionsMap = useMemo(() => {
        return statusOptions.map((item) => ({
            value: item.statusId,
            label: item.label,
            color: item.color,
        }));
    }, [statusOptions]);

    const [fetchedFiltersSectionConfigFromApi, setFetchedFiltersSectionConfigFromApi] = useState(false);

    const [withoutFilterResponseSize, setWithoutFilterResponseSize] = useState(null);

    const {
        isLoading: isFetchingTableData,
        fetchTableData,
        tableData,
        fetchTableDataWithoutFilters,
        filteredEligibleCount,
    } = useFetchCampaignLeads();

    const filterLabel = useMemo(() => {
        if (!selectedFilterSections?.length > 0) {
            return null;
        }
        return selectedFilterSections
            ?.map((item, index) => {
                let section;
                if (item && item?.root) {
                    const rootSection = filterSectionsConfig[item.root];
                    section = rootSection?.options?.find((option) => option.value === item.sectionId);
                } else {
                    section = filterSectionsConfig[item.sectionId];
                }
                let thisItemLabel = "";
                let andOrLabel = "";
                if (index !== selectedFilterSections.length - 1) {
                    if (item.nextAndOrOption === "or") {
                        andOrLabel = `<span> or </span>`;
                    } else {
                        andOrLabel = `<span> and </span>`;
                    }
                }
                if (section.options) {
                    const label =
                        section.options.find((item1) => item1.value === item.selectedFilterOption)?.label || "";
                    thisItemLabel = `<span>
                ${section.heading} ${item.selectedIsOption === "is_not" ? "is not" : "is"}
                <span style="font-weight:bold">${label}</span>
              </span>`;
                } else if (section.option) {
                    thisItemLabel = `<span>
                ${section.heading} ${
                        item.selectedIsOption === "is_not" ? "is not" : "is"
                    } <span style="font-weight:bold">${section.option.label || ""}</span>
              </span>`;
                }
                return thisItemLabel + andOrLabel;
            })
            .join("");
    }, [selectedFilterSections, filterSectionsConfig]);

    useEffect(() => {
        const selectedFilterSections = JSON.parse(
            sessionStorage.getItem("campaign_contactList_selectedFilterSections")
        );
        if (selectedFilterSections?.length > 0 && tableData?.length === 0 && filteredEligibleCount === 0) {
            resetData(selectedFilterSections);
        }
    }, []);

    const fetchAllListCount = useCallback(async () => {
        if (!withoutFilterResponseSize) {
            const response = await fetchTableDataWithoutFilters({
                searchString: null,
                sort: DEFAULT_SORT,
                statusOptionsMap,
                searchId,
            });
            setWithoutFilterResponseSize(response?.total);
        }
    }, [withoutFilterResponseSize, fetchTableDataWithoutFilters]);

    const resetData = useCallback(
        (newSelectedFilterSections) => {
            if (searchId) {
                fetchAllListCount();
                fetchTableData({
                    sort: DEFAULT_SORT,
                    searchString: undefined,
                    selectedFilterSections: newSelectedFilterSections,
                    isSilent: true,
                    returnAll: true,
                    searchId,
                    statusOptionsMap,
                });
            }
        },
        [searchId, , statusOptionsMap]
    );

    const setFilterSectionsConfig = useCallback(
        (newValue) => {
            setFilterSectionsConfigState(newValue);
            sessionStorage.setItem("campaign_contactList_filterSectionsConfig", JSON.stringify(newValue));
        },
        [setFilterSectionsConfigState]
    );

    const setSelectedFilterSections = useCallback(
        (filters) => {
            setSelectedFilterSectionsState(filters);
            sessionStorage.setItem("campaign_contactList_selectedFilterSections", JSON.stringify(filters));
        },
        [setSelectedFilterSectionsState]
    );

    useEffect(() => {
        handleSummaryBarInfo(tableData, filterLabel, filteredEligibleCount);
    }, [tableData, filterLabel, filteredEligibleCount]);

    if (isFetchingTableData) {
        return <Spinner />;
    }

    return (
        <ContactListFilterOptionsV2
            setSelectedFilterSections={setSelectedFilterSections}
            selectedFilterSections={selectedFilterSections}
            resetData={resetData}
            filterSectionsConfig={filterSectionsConfig}
            setFilterSectionsConfig={setFilterSectionsConfig}
            fetchedFiltersSectionConfigFromApi={fetchedFiltersSectionConfigFromApi}
            setFetchedFiltersSectionConfigFromApi={setFetchedFiltersSectionConfigFromApi}
        />
    );
}
