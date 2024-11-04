import { useState, useContext, useEffect, useRef } from "react";
import { ChevronLeft, Add } from "@mui/icons-material";
import { Button } from "components/ui/Button";
import styles from "./styles.module.scss";
import { Box } from "@mui/material";
import Close from "./icons/close.svg";
import Icon from "components/Icon";
import Popover from "@mui/material/Popover";

import FilterSectionBox from "./FilterSectionBox/index";
import { styled } from "@mui/system";
import { FILTER_ICONS, reminderFilters } from "packages/ContactListFilterOptionsV2/FilterSectionsConfig";
import useFetch from "hooks/useFetch";
import stylesFilterSectionBox from "./FilterSectionBox/styles.module.scss";
import StageStatusContext from "contexts/stageStatus";

import useAnalytics from "hooks/useAnalytics";
import Askintegrity from "components/icons/version-2/AskIntegrity";

const StyledPopover = styled(Popover)(() => ({
    ".MuiPopover-paper": {
        marginTop: "10px",
        minWidth: "200px",
        maxHeight: "300px",
        maxWidth: "100px !important",
        zIndex: 13000,
    },
}));

export default function ContactListFilterOptionsV2({
    setSelectedFilterSections,
    selectedFilterSections,
    resetData,
    filterSectionsConfig,
    setFilterSectionsConfig,
    fetchedFiltersSectionConfigFromApi,
    setFetchedFiltersSectionConfigFromApi,
}) {
    const URL = `${process.env.REACT_APP_LEADS_URL}/api/v2.0`;
    const { Get: fetchLeadTags } = useFetch(URL);
    const { fireEvent } = useAnalytics();
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const isApiCallInitiated = useRef(false);
    const { statusOptions } = useContext(StageStatusContext);
    const [isFilterSelectOpenForSection, setIsFilterSelectOpenForSection] = useState(null);

    useEffect(() => {
        async function fetchData() {
            isApiCallInitiated.current = true;
            const path = "Tag/TagsGroupByCategory?mappedLeadTagsOnly=true";
            const path1 = "Tag/TagsGroupByCategory?mappedLeadTagsOnly=false";
            const [data, dataWithFalse] = await Promise.all([
                fetchLeadTags(null, false, path),
                fetchLeadTags(null, false, path1),
            ]);
            const campaignTitleObject = data?.find((item) => item.tagCategoryName === "Campaign Title");
            const carrierTagsObject = data?.find((item) => item.tagCategoryName === "Carrier");

            const productStatusObject = dataWithFalse?.find((item) => item.tagCategoryName === "Product Status");
            const productTypeObject = dataWithFalse?.find((item) => item.tagCategoryName === "Product Type");
            const healthSoAObject = dataWithFalse?.find((item) => item.tagCategoryName === "Health SOA");

            const campaignSourceObject = dataWithFalse?.find((item) => item.tagCategoryName === "Campaign Source");
            const campaignTypeObject = dataWithFalse?.find((item) => item.tagCategoryName === "Campaign Type");
            const campaignInterestObject = dataWithFalse?.find((item) => item.tagCategoryName === "Campaign Interest");

            const askIntegrityObject = data?.find(
                (item) => item.tagCategoryName === "Ask Integrity Suggests" && item.tags.length > 0
            );
            const sortedAskIntegrityTags = askIntegrityObject?.tags?.sort((a, b) => {
                const regex = /\d+/;
                const aHasNumber = regex.test(a.tagLabel);
                const bHasNumber = regex.test(b.tagLabel);

                if (!aHasNumber && !bHasNumber) {
                    // Both a and b do not have numbers, sort alphabetically
                    return a.tagLabel.localeCompare(b.tagLabel);
                } else if (!aHasNumber) {
                    // a does not have a number, b does, a comes first
                    return -1;
                } else if (!bHasNumber) {
                    // b does not have a number, a does, b comes first
                    return 1;
                } else {
                    // Both a and b have numbers, sort by the numerical value
                    const aNumber = parseInt(a.tagLabel.match(regex)[0], 10);
                    const bNumber = parseInt(b.tagLabel.match(regex)[0], 10);
                    return aNumber - bNumber;
                }
            });

            const customTagsObject = data?.find((item) => item.tagCategoryName === "Other");

            const productTypeOptions =
                productTypeObject?.tags
                    ?.map((item) => {
                        let label;
                        if (item.tagLabel === "PDP") {
                            label = "PDP";
                        } else if (item.tagLabel === "MAPD") {
                            label = "MAPD";
                        } else if (item.tagLabel === "FINAL EXPENSE" || item.tagLabel === "FEXP") {
                            label = "FINAL EXPENSE";
                        } else if (item.tagLabel === "MEDICARE ADVANTAGE" || item.tagLabel === "HEALTH") {
                            label = "MEDICARE ADVANTAGE";
                        }
                        return {
                            label: label,
                            value: item.tagId,
                            icon: item.tagIconUrl || FILTER_ICONS["MEDICARE"],
                        };
                    })
                    ?.filter((item, index, self) => {
                        return item?.label && index === self.findIndex((t) => t.label === item.label);
                    }) || [];

            const healthSoaOptions = healthSoAObject?.tags
                .filter(
                    (item) =>
                        (item.tagLabel === "SOA SIGNED" && item.tagIconUrl) ||
                        (item.tagLabel === "SOA SENT" && item.tagIconUrl) ||
                        item.tagLabel === "SOA COMPLETED"
                )
                .map((item) => ({
                    label: item.tagLabel,
                    value: item.tagId,
                    icon: item.tagIconUrl || FILTER_ICONS["STARTED"],
                }));

            const campaignSourceOptions = campaignSourceObject?.tags?.map((item) => ({
                label: item.tagLabel,
                value: item.tagId,
                icon: item.tagIconUrl || FILTER_ICONS["SOURCE_DEFAULT"],
            }));

            setFilterSectionsConfig({
                reminders: {
                    heading: "Reminders",
                    options: reminderFilters,
                },
                stage: {
                    heading: "Stage",
                    options: statusOptions?.map((item) => ({
                        value: item.statusId,
                        label: item.label,
                        color: item.color,
                    })),
                },
                product_tags: {
                    heading: "Product Tags",
                    options: [
                        {
                            label: "Product Status",
                            heading: "Product Status",
                            value: "product_status",
                            icon: FILTER_ICONS["NONE"],
                            options: productStatusObject?.tags?.map((item) => ({
                                label: item.tagLabel,
                                value: item.tagId,
                                icon: item.tagIconUrl || FILTER_ICONS[item.tagLabel],
                                iconClassName: stylesFilterSectionBox.menuItemIconMedium,
                            })),
                        },
                        {
                            label: "Product Type",
                            heading: "Product Type",
                            value: "product_type",
                            icon: FILTER_ICONS["MEDICARE"],
                            options: productTypeOptions,
                        },
                        {
                            label: "Carrier",
                            value: "carrier",
                            heading: "Carrier",
                            icon: FILTER_ICONS["CARRIER"],
                            options:
                                carrierTagsObject?.tags?.map((item) => ({
                                    label: item.tagLabel,
                                    value: item.tagId,
                                    icon: item.tagIconUrl || FILTER_ICONS[item.tagLabel],
                                })) || [],
                        },
                        {
                            label: "Health SOA",
                            value: "health_soa",
                            heading: "Health SOA",
                            icon: FILTER_ICONS["STARTED"],
                            options: healthSoaOptions,
                        },
                    ],
                },
                campaign_tags: {
                    heading: "Campaign Tags",
                    options: [
                        {
                            label: "Campaign Source",
                            value: "campaign_source",
                            heading: "Campaign Source",
                            icon: FILTER_ICONS["SOURCE_DEFAULT"],
                            options: campaignSourceOptions,
                        },
                        {
                            label: "Campaign Type",
                            value: "campaign_type",
                            heading: "Campaign Type",
                            icon: FILTER_ICONS["TYPE_DEFAULT"],
                            options: campaignTypeObject?.tags?.map((item) => ({
                                label: item.tagLabel,
                                value: item.tagId,
                                icon: item.tagIconUrl || FILTER_ICONS[item.tagLabel],
                            })),
                        },
                        {
                            label: "Campaign Title",
                            value: "campaign_title",
                            heading: "Campaign Title",
                            icon: FILTER_ICONS["TITLE_DEFAULT"],
                            options: campaignTitleObject?.tags?.map((item) => ({
                                label: item.tagLabel,
                                value: item.tagId,
                                icon: item.tagIconUrl || FILTER_ICONS["TITLE_DEFAULT"],
                            })),
                        },
                        {
                            label: "Campaign Interest",
                            value: "campaign_interest",
                            heading: "Campaign Interest",
                            icon: FILTER_ICONS["INTEREST_DEFAULT"],
                            options: campaignInterestObject?.tags?.map((item) => ({
                                label: item.tagLabel,
                                value: item.tagId,
                                icon: item.tagIconUrl || FILTER_ICONS[item.tagLabel],
                            })),
                        },
                    ],
                },
                askIntegrity_tags: {
                    heading: "Ask Integrity Suggests",
                    options: sortedAskIntegrityTags?.map((item) => ({
                        label: item.tagLabel,
                        value: item.tagId,
                        icon: item.tagIconUrl || Askintegrity,
                    })),
                },
                custom_tags: {
                    heading: "Custom Tags",
                    options: customTagsObject?.tags?.map((item) => ({
                        label: item.tagLabel,
                        value: item.tagId.toString(),
                        icon: item.tagIconUrl || FILTER_ICONS["CUSTOM_TAG"],
                    })),
                },
            });
            setFetchedFiltersSectionConfigFromApi(true);
        }
        if (!fetchedFiltersSectionConfigFromApi && statusOptions?.length && !isApiCallInitiated.current) {
            try {
                fetchData();
            } catch (e) {
                console.log("ERROR", e);
            }
        }
    }, [statusOptions]);

    const handleOnClickAddNew = (event) => {
        setAnchorEl(event.currentTarget);
        setIsFilterDropdownOpen(true);
    };

    const handleCloseFilterDropdown = () => {
        setAnchorEl(null);
        setIsFilterDropdownOpen(false);
    };

    const handleFilterOptionClick = ({ root = "", sectionId = "", value = "" }) => {
        const uuid = Math.random().toString(36).substring(7);
        const optionObject = { id: uuid, sectionId };

        let filterSection;
        if (root) {
            const rootConfig = filterSectionsConfig[root];
            filterSection = rootConfig?.options?.find((item) => item.value === sectionId);
            optionObject.root = root;
        } else {
            filterSection = filterSectionsConfig[sectionId];
        }
        if (!value && filterSection.option) {
            optionObject.selectedFilterOption = filterSection.option.value;
            setTimeout(() => resetData([...selectedFilterSections, optionObject]), 100);
        }

        if (value) {
            optionObject.selectedFilterOption = value;
            const gotItem = filterSection.options.find((item) => item.value == value);
            optionObject.option = { label: gotItem?.label, value: value };
            setTimeout(() => resetData([...selectedFilterSections, optionObject]), 100);
        }

        if ((sectionId === "reminders" || sectionId === "stage") && selectedFilterSections.length >= 1) {
            selectedFilterSections[selectedFilterSections.length - 1].nextAndOrOption = "and";
        }
        setSelectedFilterSections([...selectedFilterSections, optionObject]);
        if (sectionId !== "custom_tags" && sectionId !== "askIntegrity_tags") {
            setIsFilterSelectOpenForSection(uuid);
        }
        handleCloseFilterDropdown();
    };

    const handleOnRemoveFilterSection = (sectionUUId) => {
        const newSelectedFilterSections = selectedFilterSections.filter((section) => section.id !== sectionUUId);
        setSelectedFilterSections([...newSelectedFilterSections]);
        setTimeout(() => resetData(newSelectedFilterSections), 100);
    };

    const handleOnChangeFilterOption = (sectionUUId, value) => {
        const newSelectedFilterSections = selectedFilterSections.map((section) => {
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
        const newSelectedFilterSections = selectedFilterSections.map((section) => {
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
        const newSelectedFilterSections = selectedFilterSections.map((section) => {
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

    const handleClearAllClick = () => {
        setSelectedFilterSections([]);
        fireEvent("Closed Tag Filter");
        setTimeout(() => resetData([]), 100);
    };

    const id = open ? "simple-popover-dropdown" : undefined;

    const hasUnfinishedFilterSections = selectedFilterSections.filter((item) => !item.selectedFilterOption).length;

    const hasReminderSection = selectedFilterSections.find((item) => item.sectionId === "reminders");
    return (
        <Box overflowY={"scroll"} maxHeight={"400px"}>
            <Box padding={2}>
                {selectedFilterSections.map((section, index) => {
                    const shouldShowAndOr =
                        index !== selectedFilterSections.length - 1 &&
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
                {selectedFilterSections.length < 3 && (
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
                                onClick={() => handleFilterOptionClick({ sectionId: "stage" })}
                            >
                                Stage
                            </Box>
                            {!hasReminderSection && (
                                <Box
                                    className={`${styles.dropdownOption} ${styles.dropdownOptionWithBorderRadius}`}
                                    onClick={() => handleFilterOptionClick({ sectionId: "reminders" })}
                                >
                                    Reminders
                                </Box>
                            )}
                        </span>
                        {Boolean(filterSectionsConfig?.product_tags?.options?.length) && (
                            <span>
                                <span className={styles.filterDropdownHeader}>
                                    {filterSectionsConfig?.product_tags?.heading}
                                </span>

                                {filterSectionsConfig?.product_tags?.options?.map((item) => (
                                    <Box
                                        key={item.value}
                                        className={styles.dropdownOption}
                                        onClick={() =>
                                            handleFilterOptionClick({ root: "product_tags", sectionId: item.value })
                                        }
                                    >
                                        {item.label}
                                    </Box>
                                ))}
                            </span>
                        )}

                        {Boolean(filterSectionsConfig?.campaign_tags?.options?.length) && (
                            <span>
                                <span className={styles.filterDropdownHeader}>
                                    {filterSectionsConfig?.campaign_tags?.heading}
                                </span>

                                {filterSectionsConfig?.campaign_tags?.options?.map((item) => (
                                    <Box
                                        key={item.value}
                                        className={styles.dropdownOption}
                                        onClick={() =>
                                            handleFilterOptionClick({ root: "campaign_tags", sectionId: item.value })
                                        }
                                    >
                                        {item.label}
                                    </Box>
                                ))}
                            </span>
                        )}

                        <span className={styles.filterDropdownHeader}>Ask Integrity Suggests</span>
                        <span>
                            {filterSectionsConfig?.askIntegrity_tags?.options?.map((item) => (
                                <Box
                                    key={item.tagId}
                                    className={styles.dropdownOption}
                                    onClick={() =>
                                        handleFilterOptionClick({ sectionId: `askIntegrity_tags`, value: item.value })
                                    }
                                >
                                    {item.label}
                                </Box>
                            ))}
                        </span>
                        {Boolean(filterSectionsConfig?.custom_tags?.options?.length) && (
                            <span className={styles.filterDropdownHeader}>Custom Tags</span>
                        )}
                        <span>
                            {filterSectionsConfig?.custom_tags?.options?.map((tag) => (
                                <Box
                                    key={tag.tagId}
                                    className={styles.dropdownOption}
                                    onClick={() =>
                                        handleFilterOptionClick({ sectionId: `custom_tags`, value: tag.value })
                                    }
                                >
                                    <Icon className={styles.menuItemIcon} image={FILTER_ICONS["CUSTOM_TAG"]} />
                                    {tag.label}
                                </Box>
                            ))}
                        </span>
                    </Box>
                </StyledPopover>
            </Box>
            <Box className={styles.footer}>
                {selectedFilterSections.length > 0 && (
                    <Button
                        className={styles.footerCloseButton}
                        icon={<Icon className={styles.footerCloseIcon} image={Close} />}
                        iconPosition={"right"}
                        label={"Clear All"}
                        onClick={handleClearAllClick}
                    />
                )}
            </Box>
        </Box>
    );
}
