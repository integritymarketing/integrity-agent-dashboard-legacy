/* eslint-disable max-lines-per-function */
import { useState, useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, Add } from "@mui/icons-material";
import Close from "./icons/close.svg";
import Icon from "components/Icon";
import Popover from "@mui/material/Popover";
import FilterSectionBox from "./FilterSectionBox/index";
import { styled } from "@mui/system";
import { FILTER_ICONS, reminderFilters } from "packages/ContactListFilterOptionsV2/FilterSectionsConfig";
import useFetch from "hooks/useFetch";
import StageStatusContext from "contexts/stageStatus";
import useAnalytics from "hooks/useAnalytics";
import { Box, Button } from "@mui/material";
import styles from "./styles.module.scss";

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
    setSelectedFilterSections = () => {},
    selectedFilterSections,
    resetData,
    filterSectionsConfig,
    setFilterSectionsConfig,
    fetchedFiltersSectionConfigFromApi,
    setFetchedFiltersSectionConfigFromApi,
    isSingleSelect,
    handleSaveButton,
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

            const groupTagsByCategory = (categories) => {
                const groupedTags = [];
                const processedParents = new Set();
                let remainingCategories = [...categories];

                // Process parent categories and their children
                remainingCategories
                    .filter((category) => category.parentTagCategoryId === null)
                    .forEach((parentCategory) => {
                        const childCategories = remainingCategories.filter(
                            (category) => category.parentTagCategoryId === parentCategory.tagCategoryId
                        );

                        if (childCategories.length > 0) {
                            const childOptions = childCategories
                                .map((childCategory) => {
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
                                                iconClassName: "menuItemIconMedium",
                                            })),
                                        };
                                    }
                                    return null;
                                })
                                .filter(Boolean);

                            if (childOptions.length > 0) {
                                groupedTags.push({
                                    heading: parentCategory.tagCategoryName,
                                    options: childOptions,
                                });
                            }

                            processedParents.add(parentCategory.tagCategoryId);
                            remainingCategories = remainingCategories.filter(
                                (category) => !childCategories.includes(category)
                            );
                        } else if (parentCategory.tags && parentCategory.tags.length > 0) {
                            // Handle parent categories with null parentTagCategoryId but no matching children
                            groupedTags.push({
                                heading:
                                    parentCategory.tagCategoryName === "Other"
                                        ? "Custom Tags"
                                        : parentCategory.tagCategoryName,
                                options: parentCategory.tags.map((tag) => ({
                                    label: tag.tagLabel,
                                    value: tag.tagId,
                                    icon: tag.tagIconUrl || FILTER_ICONS.default,
                                    iconClassName: "menuItemIconMedium",
                                })),
                            });
                        }
                    });

                // Handle categories without parents or children (orphans)
                remainingCategories.forEach((orphanCategory) => {
                    if (
                        !processedParents.has(orphanCategory.tagCategoryId) &&
                        orphanCategory.tags &&
                        orphanCategory.tags.length > 0
                    ) {
                        groupedTags.push({
                            heading: orphanCategory.tagCategoryName,
                            options: orphanCategory.tags.map((tag) => ({
                                label: tag.tagLabel,
                                value: tag.tagId,
                                icon: tag.tagIconUrl || FILTER_ICONS.default,
                                iconClassName: "menuItemIconMedium",
                            })),
                        });
                    }
                });

                // Remove any empty groups and prevent duplicate headings
                return groupedTags.filter(
                    (group, index, self) =>
                        group.options.length > 0 && self.findIndex((g) => g.heading === group.heading) === index
                );
            };

            const groupedCategories = groupTagsByCategory(tagsData);

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

    const handleOnClickAddNew = (event) => {
        setAnchorEl(event.currentTarget);
        setIsFilterDropdownOpen(true);
    };

    const handleCloseFilterDropdown = () => {
        setAnchorEl(null);
        setIsFilterDropdownOpen(false);
    };

    const handleResetOrSave = (newSelectedFilterSections, isEmpty) => {
        if (handleSaveButton) {
            setSelectedFilterSections(isEmpty ? [] : [...newSelectedFilterSections]);
            resetData(newSelectedFilterSections);
        } else {
            setTimeout(() => resetData(newSelectedFilterSections), 100);
        }
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
        handleResetOrSave(newSelectedFilterSections);
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
        handleResetOrSave(newSelectedFilterSections);
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
        handleResetOrSave(newSelectedFilterSections);
    };

    const handleClearAllClick = () => {
        fireEvent("Closed Tag Filter");
        handleResetOrSave([], true);
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
            if (sectionId === "Custom Tags") {
                filterSection = filterSectionsConfig?.tags?.find((item) => item.heading === sectionId);
            } else {
                filterSection = filterSectionsConfig[sectionId];
            }
        }
        if (!value && filterSection.option) {
            optionObject.selectedFilterOption = filterSection.option.value;
            handleResetOrSave([...selectedFilterSections, optionObject]);
        }

        if (value) {
            optionObject.selectedFilterOption = value;
            const gotItem = filterSection.options.find((item) => item.value == value);
            optionObject.option = { label: gotItem?.label, value: value };
            handleResetOrSave([...selectedFilterSections, optionObject]);
        }

        if ((sectionId === "reminders" || sectionId === "stage") && selectedFilterSections.length >= 1) {
            selectedFilterSections[selectedFilterSections.length - 1].nextAndOrOption = "and";
        }
        setSelectedFilterSections([...selectedFilterSections, optionObject]);
        if (sectionId !== "Custom Tags") {
            setIsFilterSelectOpenForSection(uuid);
        }
        handleCloseFilterDropdown();
    };

    const renderDropdownOptions = () => {
        if (!filterSectionsConfig || !filterSectionsConfig?.tags?.length) {
            return null;
        }
        return filterSectionsConfig?.tags?.map((category, index) => {
            if (category?.heading === "Other") {
                return null;
            }
            return (
                <Box key={index}>
                    <span className={styles.filterDropdownHeader}>{category?.heading}</span>
                    {category?.options?.map((subCategory) => (
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
            );
        });
    };

    const handleOnRemoveFilterSection = (sectionUUId) => {
        const newSelectedFilterSections = selectedFilterSections.filter((section) => section.id !== sectionUUId);
        handleResetOrSave(newSelectedFilterSections);
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
                        size="medium"
                        variant="contained"
                        color="primary"
                        endIcon={<ChevronLeft className={styles.chevronIcon} />}
                        startIcon={<Add />}
                        onClick={handleOnClickAddNew}
                        disabled={Boolean(hasUnfinishedFilterSections)}
                    >
                        Add Filter
                    </Button>
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
                            {!hasReminderSection && !isSingleSelect && (
                                <Box
                                    className={`${styles.dropdownOption} ${styles.dropdownOptionWithBorderRadius}`}
                                    onClick={() => handleFilterOptionClick({ sectionId: "reminders" })}
                                >
                                    Reminders
                                </Box>
                            )}
                        </span>
                        {renderDropdownOptions()}
                        {filterSectionsConfig?.tags?.find((item) => item.heading === "Other") && (
                            <Box>
                                <span className={styles.filterDropdownHeader}>Custom Tags</span>
                                {filterSectionsConfig?.tags
                                    ?.find((item) => item.heading === "Other")
                                    ?.options?.map((subCategory) => (
                                        <Box key={subCategory.value}>
                                            <Box
                                                className={styles.dropdownOption}
                                                onClick={() =>
                                                    handleFilterOptionClick({
                                                        sectionId: "Custom Tags",
                                                        value: subCategory.value,
                                                    })
                                                }
                                            >
                                                {subCategory.label}
                                            </Box>
                                        </Box>
                                    ))}
                            </Box>
                        )}
                    </Box>
                </StyledPopover>
            </Box>
            {!isSingleSelect && !handleSaveButton && (
                <Box className={styles.footer}>
                    {selectedFilterSections.length > 0 && (
                        <Button
                            size="medium"
                            variant="outlined"
                            color="primary"
                            endIcon={<Icon className={styles.footerCloseIcon} image={Close} />}
                            onClick={handleClearAllClick}
                        >
                            Clear All
                        </Button>
                    )}
                </Box>
            )}
            {handleSaveButton && (
                <Box className={styles.footer}>
                    <Button
                        size="medium"
                        variant="contained"
                        color="primary"
                        onClick={handleSaveButton}
                        disabled={Boolean(hasUnfinishedFilterSections) || selectedFilterSections?.length === 0}
                    >
                        Save
                    </Button>
                </Box>
            )}
        </Box>
    );
}

ContactListFilterOptionsV2.propTypes = {
    setSelectedFilterSections: PropTypes.func.isRequired,
    selectedFilterSections: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            sectionId: PropTypes.string.isRequired,
            selectedFilterOption: PropTypes.string,
            selectedIsOption: PropTypes.string,
            nextAndOrOption: PropTypes.string,
        })
    ).isRequired,
    resetData: PropTypes.func.isRequired,
    filterSectionsConfig: PropTypes.object.isRequired,
    setFilterSectionsConfig: PropTypes.func.isRequired,
    fetchedFiltersSectionConfigFromApi: PropTypes.bool.isRequired,
    setFetchedFiltersSectionConfigFromApi: PropTypes.func.isRequired,
    isSingleSelect: PropTypes.bool.isRequired,
};
