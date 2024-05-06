import { Box } from "@mui/material";
import { Button } from "components/ui/Button";
import Close from "./close.svg";
import Icon from "components/Icon";
import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";
import styles from "./filterResultBannerStyles.module.scss";
import { useMemo } from "react";
import { useWindowSize } from "hooks/useWindowSize";
import useAnalytics from "hooks/useAnalytics";

function FilterResultBanner() {
    const {
        withoutFilterResponseSize,
        selectedFilterSections: selectedFilterSectionsOriginal,
        setSelectedFilterSections,
        resetData,
        filterSectionsConfig,
        pageResult,
    } = useContactsListContext();
    const { fireEvent } = useAnalytics();

    const selectedFilterSections = selectedFilterSectionsOriginal.filter((item) => item.selectedFilterOption);

    const { width: windowWidth } = useWindowSize();
    const isMobile = windowWidth <= 784;

    const handleClearAllClick = () => {
        setSelectedFilterSections([]);
        fireEvent("Closed Tag Filter");
        setTimeout(() => resetData([]), 100);
    };

    function capitalizeFirstLetter(sectionId, string) {
        if (sectionId === "product_type") {
            return string;
        }
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    const filterLabel = useMemo(() => {
        return selectedFilterSections
            .map((item, index) => {
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
                ${section.heading} ${item.selectedIsOption === "is_not" ? "is not" : "is"
                        } <span style="font-weight:bold">${section.option.label || ""}</span>
              </span>`;
                }
                return thisItemLabel + andOrLabel;
            })
            .join("");
    }, [selectedFilterSections, filterSectionsConfig]);


    if (!selectedFilterSections?.length) {
        return null;
    }
    return (
        <Box className={styles.bannerContainer}>
            <Box>
                Showing {pageResult?.total} of {withoutFilterResponseSize} contacts |
                <span className={styles.filterLabelSpan} dangerouslySetInnerHTML={{ __html: filterLabel }}></span>
            </Box>
            <Box>
                <Button
                    className={styles.footerCloseButton}
                    icon={<Icon className={styles.footerCloseIcon} image={Close} />}
                    iconPosition={"right"}
                    label={isMobile ? "" : "Clear Filter"}
                    onClick={handleClearAllClick}
                />
            </Box>
        </Box>
    );
}

export default FilterResultBanner;
