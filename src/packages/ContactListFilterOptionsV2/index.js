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
    isSingleSelect,
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
            const tagsData = await fetchLeadTags(null, false, path);

            /**
             * Helper function to format data by grouping based on parent-child relationships
             * Ensures no duplicate parents in the final grouped tags list
             * @param {Array} categories - List of categories to group
             * @returns {Object} - Grouped tag sections
             */
            const groupTagsByCategory = (categories) => {
                const groupedTags = [];
                const processedParents = new Set();
                let remainingCategories = [...categories];

                // Process parent categories and their children
                remainingCategories
                    .filter((category) => category.parentTagCategoryId === null)
                    .forEach((parentCategory) => {
                        if (!processedParents.has(parentCategory.tagCategoryId)) {
                            const childCategories = remainingCategories.filter(
                                (category) => category.parentTagCategoryId === parentCategory.tagCategoryId
                            );

                            const childOptions = childCategories
                                .map((childCategory) => {
                                    // Only map child if it has tags
                                    if (childCategory.tags && childCategory.tags.length > 0) {
                                        return {
                                            label: childCategory.tagCategoryName,
                                            heading: childCategory.tagCategoryName,
                                            value: childCategory.tagCategoryName,
                                            icon: FILTER_ICONS[childCategory.tagCategoryName] || FILTER_ICONS.default,
                                            options: childCategory.tags.map((tag) => ({
                                                label: tag.tagLabel,
                                                value: tag.tagId,
                                                icon:
                                                    tag.tagIconUrl ||
                                                    FILTER_ICONS[tag.tagLabel] ||
                                                    FILTER_ICONS.default,
                                                iconClassName: "menuItemIconMedium", // Use CSS class if available
                                            })),
                                        };
                                    }
                                    return null; // Skip childCategory if it has no tags
                                })
                                .filter(Boolean); // Remove null values

                            // Only add parent if it has valid childOptions
                            if (childOptions.length > 0) {
                                groupedTags.push({
                                    heading: parentCategory.tagCategoryName,
                                    options: childOptions,
                                });
                            }

                            // Mark parent as processed and remove children from remainingCategories
                            processedParents.add(parentCategory.tagCategoryId);
                            remainingCategories = remainingCategories.filter(
                                (category) => !childCategories.includes(category)
                            );
                        }
                    });

                // Handle categories without parents or children
                remainingCategories.forEach((orphanCategory) => {
                    if (!processedParents.has(orphanCategory.tagCategoryId) && orphanCategory.tags.length > 0) {
                        groupedTags.push({
                            header: orphanCategory.tagCategoryName,
                            children: orphanCategory.tags.map((tag) => ({
                                label: tag.tagLabel,
                                value: tag.tagId,
                                icon: tag.tagIconUrl || FILTER_ICONS.default,
                            })),
                        });
                    }
                });

                return groupedTags;
            };

            const groupedCategories = groupTagsByCategory(tagsData);

            console.log("Grouped Categories", groupedCategories);

            // Set dynamic filter sections
            setFilterSectionsConfig({
                reminders: {
                    heading: "Reminders",
                    options: reminderFilters,
                },
                stage: {
                    heading: "Stage",
                    options: statusOptions.map(({ statusId, label, color }) => ({
                        value: statusId,
                        label,
                        color,
                    })),
                },
                tags: groupedCategories,
            });

            setFetchedFiltersSectionConfigFromApi(true);
        }

        if (!fetchedFiltersSectionConfigFromApi && statusOptions?.length && !isApiCallInitiated.current) {
            fetchData().catch((error) => console.log("Error fetching data:", error));
        }
    }, [statusOptions]);

    console.log("Filter Sections Config", filterSectionsConfig);

    const handleOnClickAddNew = (event) => {
        setAnchorEl(event.currentTarget);
        setIsFilterDropdownOpen(true);
    };

    const handleCloseFilterDropdown = () => {
        setAnchorEl(null);
        setIsFilterDropdownOpen(false);
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

    const handleFilterOptionClick = ({ root = "", sectionId = "", value = "" }) => {
        const uuid = Math.random().toString(36).substring(7);
        const optionObject = { id: uuid, sectionId };

        let filterSection;
        if (root) {
            const rootConfig = filterSectionsConfig?.tags?.find((item) => item.heading === root);
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

    const renderDropdownOptions = () => {
        if (!filterSectionsConfig || !filterSectionsConfig?.tags?.length) return null;
        return filterSectionsConfig?.tags?.map((category, index) => (
            <Box key={index}>
                <span className={styles.filterDropdownHeader}>{category.heading}</span>
                {category.options.map((subCategory) => (
                    <Box key={subCategory.value}>
                        <Box
                            className={styles.dropdownOption}
                            onClick={() =>
                                handleFilterOptionClick({
                                    root: category.heading,
                                    sectionId: subCategory.value,
                                })
                            }
                        >
                            {subCategory.heading}
                        </Box>
                    </Box>
                ))}
            </Box>
        ));
    };

    console.log("Selected Filter Sections", selectedFilterSections);
    const handleOnRemoveFilterSection = (sectionUUId) => {
        const newSelectedFilterSections = selectedFilterSections.filter((section) => section.id !== sectionUUId);
        setSelectedFilterSections([...newSelectedFilterSections]);
        setTimeout(() => resetData(newSelectedFilterSections), 100);
    };
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
                {((selectedFilterSections?.length === 0 && isSingleSelect) ||
                    (selectedFilterSections?.length < 3 && !isSingleSelect)) && (
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
                        {renderDropdownOptions()}
                    </Box>
                </StyledPopover>
            </Box>
        </Box>
    );
}
