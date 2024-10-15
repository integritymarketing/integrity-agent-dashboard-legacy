import { useState, useEffect, useCallback, useMemo, useRef, useContext } from "react";
import { ChevronLeft, Add } from "@mui/icons-material";
import { Button } from "components/ui/Button";
import * as Sentry from "@sentry/react";
import styles from "./styles.module.scss";
import { Box, Popover } from "@mui/material";
import CustomTagIcon from "packages/ContactListFilterOptionsV2/icons/custom_tag.svg";
import CampaignSourceDefaultIcon from "packages/ContactListFilterOptionsV2/icons/campaign_source_default.svg";
import ProductStatusStarted from "packages/ContactListFilterOptionsV2/icons/product_status_started.svg";
import ProductTypeMedicare from "packages/ContactListFilterOptionsV2/icons/product_type_medicare.svg";
import CampaignInterestDefault from "packages/ContactListFilterOptionsV2/icons/campaign_interest_default.svg";
import CampaignTitleDefault from "packages/ContactListFilterOptionsV2/icons/campaign_title_default.svg";
import FilterSectionBox from "./FilterSectionBox/index";
import { styled } from "@mui/system";
import { filterSectionsConfig as filterSectionsConfigOriginal } from "packages/ContactListFilterOptionsV2/FilterSectionsConfig";
import useFetch from "hooks/useFetch";
import stylesFilterSectionBox from "./FilterSectionBox/styles.module.scss";
import useFetchCampaignLeads from "pages/ContactsList/hooks/useFetchCampaignLeads";
import Askintegrity from "components/icons/version-2/AskIntegrity";
import Spinner from "components/ui/Spinner/index";
import StageStatusContext from "contexts/stageStatus";
import Icon from "components/Icon";
import { useClientServiceContext } from "services/clientServiceProvider";

const DEFAULT_PAGE_ITEM = 12;
const DEFAULT_SORT = ["createDate:desc"];

const StyledPopover = styled(Popover)(() => ({
    ".MuiPopover-paper": {
        marginTop: "10px",
        minWidth: "200px",
        maxHeight: "300px",
        maxWidth: "100px !important",
        zIndex: 13000,
    },
}));

export default function CustomContactListFilter({ handleSummaryBarInfo, searchId }) {
    const URL = `${process.env.REACT_APP_LEADS_URL}/api/v2.0`;
    const { Get: fetchLeadTags } = useFetch(URL);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const isApiCallInitiated = useRef(false);
    const [tagsList, setTagsList] = useState([]);
    const [filterSectionsConfig, setFilterSectionsConfigState] = useState(
        JSON.parse(sessionStorage.getItem("campaign_contactList_filterSectionsConfig")) || filterSectionsConfigOriginal,
    );

    const [selectedFilterSections, setSelectedFilterSectionsState] = useState(
        JSON.parse(sessionStorage.getItem("campaign_contactList_selectedFilterSections")) || [],
    );

    const { statusOptions } = useContext(StageStatusContext);

    const statusOptionsMap = useMemo(() => {
        return statusOptions.map((item) => ({
            value: item.statusId,
            label: item.label,
            color: item.color,
        }));
    }, [statusOptions]);

    const [isFilterSelectOpenForSection, setIsFilterSelectOpenForSection] = useState(null);

    const [fetchedFiltersSectionConfigFromApi, setFetchedFiltersSectionConfigFromApi] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [withoutFilterResponseSize, setWithoutFilterResponseSize] = useState(null);

    const { clientsService } = useClientServiceContext();

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
                const section = filterSectionsConfig[item.sectionId];
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
            sessionStorage.getItem("campaign_contactList_selectedFilterSections"),
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
        [searchId, , statusOptionsMap],
    );

    const setFilterSectionsConfig = useCallback(
        (newValue) => {
            setFilterSectionsConfigState(newValue);
            sessionStorage.setItem("campaign_contactList_filterSectionsConfig", JSON.stringify(newValue));
        },
        [setFilterSectionsConfigState],
    );

    const setSelectedFilterSections = useCallback(
        (filters) => {
            setSelectedFilterSectionsState(filters);
            sessionStorage.setItem("campaign_contactList_selectedFilterSections", JSON.stringify(filters));
        },
        [setSelectedFilterSectionsState],
    );

    useEffect(() => {
        async function fetchData() {
            isApiCallInitiated.current = true;
            const path = `Tag/TagsGroupByCategory?mappedLeadTagsOnly=true`;
            const path1 = `Tag/TagsGroupByCategory?mappedLeadTagsOnly=false`;
            const [data, dataWithFalse] = await Promise.all([
                fetchLeadTags(null, false, path),
                fetchLeadTags(null, false, path1),
            ]);
            const campaignTitleObject = data.find((item) => item.tagCategoryName === "Campaign Title");
            const carrierTagsObject = data.find((item) => item.tagCategoryName === "Carrier");
            const productStatusObject = dataWithFalse.find((item) => item.tagCategoryName === "Product Status");
            const productTypeObject = dataWithFalse.find((item) => item.tagCategoryName === "Product Type");
            const healthSoAObject = dataWithFalse.find((item) => item.tagCategoryName === "Health SOA");
            const campaignSourceObject = dataWithFalse.find((item) => item.tagCategoryName === "Campaign Source");
            const campaignTypeObject = dataWithFalse.find((item) => item.tagCategoryName === "Campaign Type");
            const campaignInterestObject = dataWithFalse.find((item) => item.tagCategoryName === "Campaign Interest");
            const askIntegrityObject =
                dataWithFalse.find(
                    (item) => item.tagCategoryName === "Ask Integrity Recommendations" && item.tags.length > 0,
                ) ||
                dataWithFalse.find((item) => item.tagCategoryName === "Ask Integrity Suggests" && item.tags.length > 0);
            const customTagsObject = data.find((item) => item.tagCategoryName === "Other");
            const productTypePdpOption = productTypeObject.tags.find(
                (item) => item.tagLabel === "PDP" && item.tagIconUrl,
            );
            const productTypeMapdOption = productTypeObject.tags.find(
                (item) => item.tagLabel === "MAPD" && item.tagIconUrl,
            );
            const productTypeFinalExpenseOption = productTypeObject.tags.find(
                (item) => item.tagLabel === "FINAL EXPENSE" || item.tagLabel === "FEXP",
            );
            const productTypeMedicareAdvantageOption = productTypeObject.tags.find(
                (item) => item.tagLabel === "MEDICARE ADVANTAGE" || item.tagLabel === "HEALTH",
            );
            const productTypeOptions = [
                {
                    label: "PDP",
                    value: productTypePdpOption.tagId,
                    icon: productTypePdpOption.tagIconUrl || ProductTypeMedicare,
                },
                {
                    label: "MAPD",
                    value: productTypeMapdOption.tagId,
                    icon: productTypeMapdOption.tagIconUrl || ProductTypeMedicare,
                },
                {
                    label: "FINAL EXPENSE",
                    value: productTypeFinalExpenseOption.tagId,
                    icon: productTypeFinalExpenseOption.tagIconUrl || ProductTypeMedicare,
                },
                {
                    label: "MEDICARE ADVANTANGE",
                    value: productTypeMedicareAdvantageOption.tagId,
                    icon: productTypeMedicareAdvantageOption.tagIconUrl || ProductTypeMedicare,
                },
            ];
            const campaignSourceOptions = campaignSourceObject.tags.map((item) => ({
                label: item.tagLabel,
                value: item.tagId,
                icon: item.tagIconUrl || CampaignSourceDefaultIcon,
            }));
            const healthSoaOptions = healthSoAObject?.tags
                .filter(
                    (item) =>
                        (item.tagLabel === "SOA SIGNED" && item.tagIconUrl) ||
                        (item.tagLabel === "SOA SENT" && item.tagIconUrl) ||
                        item.tagLabel === "SOA COMPLETED",
                )
                .map((item) => ({
                    label: item.tagLabel,
                    value: item.tagId,
                    icon: item.tagIconUrl || ProductStatusStarted || "",
                }));
            setFilterSectionsConfig({
                ...filterSectionsConfig,
                campaign_title: {
                    heading: campaignTitleObject.tagCategoryName,
                    options:
                        campaignTitleObject?.tags.map((item) => ({
                            label: item.tagLabel,
                            value: item.tagId,
                            icon: item.tagIconUrl || CampaignTitleDefault,
                        })) || [],
                },
                stage: {
                    heading: "Stage",
                    options: statusOptions.map((item) => ({
                        value: item.statusId,
                        label: item.label,
                        color: item.color,
                    })),
                },
                carrier: {
                    heading: carrierTagsObject.tagCategoryName,
                    options:
                        carrierTagsObject?.tags.map((item) => ({
                            label: item.tagLabel,
                            value: item.tagId,
                            icon:
                                item.tagIconUrl ||
                                filterSectionsConfigOriginal.carrier.options.find(
                                    (item1) => item1.label === item.tagLabel,
                                )?.icon ||
                                "",
                        })) || [],
                },
                product_status: {
                    heading: "Product Status",
                    options: productStatusObject?.tags.map((item) => ({
                        label: item.tagLabel,
                        value: item.tagId,
                        icon:
                            item.tagIconUrl ||
                            filterSectionsConfigOriginal.product_status.options.find(
                                (item1) => item1.label === item.tagLabel,
                            )?.icon ||
                            "",
                        iconClassName: stylesFilterSectionBox.menuItemIconMedium,
                    })),
                },
                product_type: {
                    heading: "Product Type",
                    options: productTypeOptions,
                },
                custom_tags: {
                    heading: "Custom Tags",
                    options: customTagsObject?.tags.map((item) => ({
                        label: item.tagLabel,
                        value: item.tagId.toString(),
                        icon: item.tagIconUrl || CustomTagIcon,
                    })),
                },
                health_soa: {
                    heading: "Health SOA",
                    options: healthSoaOptions,
                },
                campaign_source: {
                    heading: "Campaign Source",
                    options: campaignSourceOptions,
                },
                campaign_type: {
                    heading: "Campaign Type",
                    options: campaignTypeObject?.tags.map((item) => ({
                        label: item.tagLabel,
                        value: item.tagId,
                        icon:
                            item.tagIconUrl ||
                            filterSectionsConfigOriginal.campaign_type.options.find(
                                (item1) => item1.label === item.tagLabel,
                            )?.icon ||
                            "",
                    })),
                },
                campaign_interest: {
                    heading: "Campaign Interest",
                    options: campaignInterestObject?.tags.map((item) => ({
                        label: item.tagLabel,
                        value: item.tagId,
                        icon: item.tagIconUrl || CampaignInterestDefault || "",
                    })),
                },
                cross_sell: {
                    heading: "Ask Integrity Suggests",
                    option: {
                        label: "Cross Sell",
                        value: askIntegrityObject?.tags.find((item) => item.tagLabel === "CROSS-SELL")?.tagId,
                        icon:
                            askIntegrityObject?.tags.find((item) => item.tagLabel === "CROSS-SELL")?.tagIconUrl ||
                            Askintegrity,
                    },
                },
                switcher: {
                    heading: "Ask Integrity Suggests",
                    option: {
                        label: "Switcher",
                        value: askIntegrityObject?.tags.find((item) => item.tagLabel === "SWITCHER")?.tagId,
                        icon:
                            askIntegrityObject?.tags.find((item) => item.tagLabel === "SWITCHER")?.tagIconUrl ||
                            Askintegrity,
                    },
                },
                sep: {
                    heading: "Ask Integrity Suggests",
                    option: {
                        label: "SEP",
                        value: askIntegrityObject?.tags.find((item) => item.tagLabel === "SEP")?.tagId,
                        icon:
                            askIntegrityObject?.tags.find((item) => item.tagLabel === "SEP")?.tagIconUrl ||
                            Askintegrity,
                    },
                },
                "Shopper Priority 1...": {
                    heading: "Ask Integrity Suggests",
                    option: {
                        label: "Shopper Priority 1...",
                        value: askIntegrityObject?.tags.find((item) => item.tagLabel?.includes("SHOPPER PRIORITY 1"))
                            ?.tagId,
                        icon:
                            askIntegrityObject?.tags.find((item) => item.tagLabel?.includes("SHOPPER PRIORITY 1"))
                                ?.tagIconUrl || Askintegrity,
                    },
                },
                "Shopper Priority 2...": {
                    heading: "Ask Integrity Suggests",
                    option: {
                        label: "Shopper Priority 2...",
                        value: askIntegrityObject?.tags.find((item) => item.tagLabel?.includes("SHOPPER PRIORITY 2"))
                            ?.tagId,
                        icon:
                            askIntegrityObject?.tags.find((item) => item.tagLabel?.includes("SHOPPER PRIORITY 2"))
                                ?.tagIconUrl || Askintegrity,
                    },
                },
                "Shopper Priority 3...": {
                    heading: "Ask Integrity Suggests",
                    option: {
                        label: "Shopper Priority 2...",
                        value: askIntegrityObject?.tags.find((item) => item.tagLabel?.includes("SHOPPER PRIORITY 3"))
                            ?.tagId,
                        icon:
                            askIntegrityObject?.tags.find((item) => item.tagLabel?.includes("SHOPPER PRIORITY 3"))
                                ?.tagIconUrl || Askintegrity,
                    },
                },
                "Shopper Priority 4...": {
                    heading: "Ask Integrity Suggests",
                    option: {
                        label: "Shopper Priority 4...",
                        value: askIntegrityObject?.tags.find((item) => item.tagLabel?.includes("SHOPPER PRIORITY 4"))
                            ?.tagId,
                        icon:
                            askIntegrityObject?.tags.find((item) => item.tagLabel?.includes("SHOPPER PRIORITY 4"))
                                ?.tagIconUrl || Askintegrity,
                    },
                },
                "Shopper Priority 5...": {
                    heading: "Ask Integrity Suggests",
                    option: {
                        label: "Shopper Priority 5...",
                        value: askIntegrityObject?.tags.find((item) => item.tagLabel?.includes("SHOPPER PRIORITY 5"))
                            ?.tagId,
                        icon:
                            askIntegrityObject?.tags.find((item) => item.tagLabel?.includes("SHOPPER PRIORITY 5"))
                                ?.tagIconUrl || Askintegrity,
                    },
                },
            });
            setFetchedFiltersSectionConfigFromApi(true);
        }
        if (!fetchedFiltersSectionConfigFromApi && !isApiCallInitiated.current) {
            try {
                fetchData();
            } catch (e) {
                console.log("ERROR", e);
            }
        }
    }, [filterSectionsConfig]);

    useEffect(() => {
        handleSummaryBarInfo(tableData, filterLabel, filteredEligibleCount);
    }, [tableData, filterLabel, filteredEligibleCount]);

    useEffect(() => {
        const getTags = async () => {
            try {
                const res = await clientsService.getAllTagsByGroups();
                setTagsList([...res]);
            } catch (error) {
                Sentry.captureException(error);
            }
        };
        getTags();
    }, []);

    const customTags = useMemo(() => {
        return tagsList.find((tag) => tag.tagCategoryName === "Other")?.tags;
    }, [tagsList]);

    const handleOnClickAddNew = (event) => {
        setAnchorEl(event.currentTarget);
        setIsFilterDropdownOpen(true);
    };

    const handleCloseFilterDropdown = () => {
        setAnchorEl(null);
        setIsFilterDropdownOpen(false);
    };

    const handleFilterOptionClick = (sectionId) => {
        const uuid = Math.random().toString(36).substring(7);
        const filterSectionConfig = filterSectionsConfig[sectionId];
        const optionObject = { id: uuid, sectionId };
        if (filterSectionConfig?.option) {
            optionObject.selectedFilterOption = filterSectionConfig.option.value;
            setTimeout(() => resetData([...selectedFilterSections, optionObject]), 100);
        } else if (sectionId.startsWith("custom_tags_")) {
            const tagId = sectionId.split("_")[2];
            optionObject.selectedFilterOption = tagId;
            const gotitem = customTags.find((item) => item.tagId == parseInt(tagId));
            optionObject.option = { label: gotitem?.tagLabel, value: parseInt(tagId) };
            optionObject.sectionId = "custom_tags";
            setTimeout(() => resetData([...selectedFilterSections, optionObject]), 100);
        }
        if ((sectionId === "reminders" || sectionId === "stage") && selectedFilterSections.length >= 1) {
            selectedFilterSections[selectedFilterSections.length - 1].nextAndOrOption = "and";
        }
        setSelectedFilterSections([...selectedFilterSections, optionObject]);
        if (!sectionId.startsWith("custom_tags_")) {
            setIsFilterSelectOpenForSection(uuid);
        }
        handleCloseFilterDropdown();
    };

    const handleOnRemoveFilterSection = (sectionUUId) => {
        const newSelectedFilterSections = selectedFilterSections?.filter((section) => section.id !== sectionUUId);
        setSelectedFilterSections([...newSelectedFilterSections]);
        setTimeout(() => resetData(newSelectedFilterSections), 100);
    };

    const handleOnChangeFilterOption = (sectionUUId, value) => {
        const newSelectedFilterSections = selectedFilterSections?.map((section) => {
            if (section.id === sectionUUId) {
                return {
                    ...section,
                    selectedFilterOption: value,
                    isFilterSelectOpen: false,
                };
            }
            return section;
        });
        setSelectedFilterSections([...newSelectedFilterSections]);
        setTimeout(() => resetData(newSelectedFilterSections), 100);
    };

    const handleOnChangeIsOption = (sectionUUId, value) => {
        const newSelectedFilterSections = selectedFilterSections?.map((section) => {
            if (section.id === sectionUUId) {
                return {
                    ...section,
                    selectedIsOption: value,
                };
            }
            return section;
        });
        setSelectedFilterSections([...newSelectedFilterSections]);
        setTimeout(() => resetData(newSelectedFilterSections), 10);
    };

    const handleOnChangeNextAndOrOption = (sectionUUId, value) => {
        const newSelectedFilterSections = selectedFilterSections?.map((section) => {
            if (section.id === sectionUUId) {
                return {
                    ...section,
                    nextAndOrOption: value,
                };
            }
            return section;
        });
        setSelectedFilterSections([...newSelectedFilterSections]);
        setTimeout(() => resetData(newSelectedFilterSections), 100);
    };

    const id = isFilterDropdownOpen ? "simple-popover-dropdown" : undefined;

    const hasUnfinishedFilterSections = selectedFilterSections?.filter((item) => !item.selectedFilterOption).length;

    const hasReminderSection = selectedFilterSections?.find((item) => item.sectionId === "reminders");

    if (isFetchingTableData || isLoading) {
        return <Spinner />;
    }

    return (
        <Box overflowY={"scroll"} maxHeight={"400px"}>
            <Box padding={2}>
                {selectedFilterSections?.map((section, index) => {
                    const shouldShowAndOr =
                        index !== selectedFilterSections?.length - 1 &&
                        selectedFilterSections[index + 1].selectedFilterOption;
                    let hasStageAndReminderNext = false;
                    if (index !== selectedFilterSections.length - 1) {
                        const nextSection = selectedFilterSections[index + 1];
                        if (nextSection.sectionId === "stage" || nextSection.sectionId === "reminders") {
                            hasStageAndReminderNext = true;
                        }
                    }
                    if (index === 0 && (section.sectionId === "stage" || section.sectionId === "reminders")) {
                        hasStageAndReminderNext = true;
                    }
                    return (
                        <FilterSectionBox
                            section={section}
                            freezeAndOption={hasStageAndReminderNext}
                            filterSectionsConfig={filterSectionsConfig}
                            key={section.id + section.nextAndOrOption}
                            isFilterSelectOpenForSection={isFilterSelectOpenForSection === section.id}
                            shouldShowAndOr={shouldShowAndOr}
                            onChangeFilterOption={(value) => handleOnChangeFilterOption(section.id, value)}
                            onChangeIsOption={(value) => handleOnChangeIsOption(section.id, value)}
                            onChangeNextAndOrOption={(value) => handleOnChangeNextAndOrOption(section.id, value)}
                            onRemove={() => handleOnRemoveFilterSection(section.id)}
                        />
                    );
                })}
                {selectedFilterSections?.length < 3 && (
                    <Button
                        data-gtm="contacts-add-new"
                        icon={<ChevronLeft className={styles.chevronIcon} />}
                        disabled={Boolean(hasUnfinishedFilterSections)}
                        iconPosition={"right"}
                        label={
                            <span className={styles.buttonText}>
                                <Add /> Add Filter
                            </span>
                        }
                        type="primary"
                        className={styles.addNewButton}
                        onClick={handleOnClickAddNew}
                    />
                )}
                <StyledPopover
                    id={id}
                    open={isFilterDropdownOpen}
                    anchorEl={anchorEl}
                    onClose={handleCloseFilterDropdown}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                >
                    <Box className={styles.filterDropdownContent} padding={1}>
                        <span>
                            <Box
                                className={`${styles.dropdownOption} ${styles.dropdownOptionWithMargin} ${styles.dropdownOptionWithBorderRadius}`}
                                onClick={() => handleFilterOptionClick("stage")}
                            >
                                Stage
                            </Box>
                            {!hasReminderSection && (
                                <Box
                                    className={`${styles.dropdownOption} ${styles.dropdownOptionWithBorderRadius}`}
                                    onClick={() => handleFilterOptionClick("reminders")}
                                >
                                    Reminders
                                </Box>
                            )}
                        </span>
                        <span className={styles.filterDropdownHeader}>Product Tags</span>
                        <span>
                            {Boolean(filterSectionsConfig.product_status?.options.length) && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("product_status")}
                                >
                                    Product Status
                                </Box>
                            )}
                            {Boolean(filterSectionsConfig.product_type?.options.length) && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("product_type")}
                                >
                                    Product Type
                                </Box>
                            )}
                            {Boolean(filterSectionsConfig.carrier?.options.length) && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("carrier")}
                                >
                                    Carrier
                                </Box>
                            )}
                            <Box
                                className={styles.dropdownOption}
                                onClick={() => handleFilterOptionClick("health_soa")}
                            >
                                Health SOA
                            </Box>
                        </span>
                        <span className={styles.filterDropdownHeader}>Campaign Tags</span>
                        <span>
                            {Boolean(filterSectionsConfig.campaign_source?.options.length) && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("campaign_source")}
                                >
                                    Campaign Source
                                </Box>
                            )}
                            {Boolean(filterSectionsConfig.campaign_type?.options.length) && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("campaign_type")}
                                >
                                    Campaign Type
                                </Box>
                            )}
                            {Boolean(filterSectionsConfig.campaign_title?.options.length) && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("campaign_title")}
                                >
                                    Campaign Title
                                </Box>
                            )}
                            {Boolean(filterSectionsConfig.campaign_interest?.options.length) && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("campaign_interest")}
                                >
                                    Campaign Interest
                                </Box>
                            )}
                        </span>
                        <span className={styles.filterDropdownHeader}>Ask Integrity Suggests</span>
                        <span>
                            {filterSectionsConfig.cross_sell.option?.value && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("cross_sell")}
                                >
                                    Cross-Sell
                                </Box>
                            )}
                            {filterSectionsConfig.switcher.option.value && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("switcher")}
                                >
                                    Switcher
                                </Box>
                            )}
                            {filterSectionsConfig.sep.option.value && (
                                <Box className={styles.dropdownOption} onClick={() => handleFilterOptionClick("sep")}>
                                    SEP
                                </Box>
                            )}
                            {filterSectionsConfig.sep.option.value && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("Shopper Priority 1...")}
                                >
                                    Shopper Priority 1...
                                </Box>
                            )}
                            {filterSectionsConfig.sep.option.value && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("Shopper Priority 2...")}
                                >
                                    Shopper Priority 2...
                                </Box>
                            )}
                            {filterSectionsConfig.sep.option.value && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("Shopper Priority 3...")}
                                >
                                    Shopper Priority 3...
                                </Box>
                            )}
                            {filterSectionsConfig.sep.option.value && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("Shopper Priority 4...")}
                                >
                                    Shopper Priority 4...
                                </Box>
                            )}
                            {filterSectionsConfig.sep.option.value && (
                                <Box
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick("Shopper Priority 5...")}
                                >
                                    Shopper Priority 5...
                                </Box>
                            )}
                        </span>
                        {Boolean(customTags?.length) && (
                            <span className={styles.filterDropdownHeader}>Custom Tags</span>
                        )}
                        <span>
                            {customTags?.map((tag) => (
                                <Box
                                    key={tag.tagId}
                                    className={styles.dropdownOption}
                                    onClick={() => handleFilterOptionClick(`custom_tags_${tag.tagId}`)}
                                >
                                    <Icon className={styles.menuItemIcon} image={CustomTagIcon} />
                                    {tag.tagLabel}
                                </Box>
                            ))}
                        </span>
                    </Box>
                </StyledPopover>
            </Box>
        </Box>
    );
}
