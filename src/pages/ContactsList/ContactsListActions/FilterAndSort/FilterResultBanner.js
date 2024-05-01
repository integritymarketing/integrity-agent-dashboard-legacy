import { Box } from "@mui/material";
import { Button } from "components/ui/Button";
import Close from "./close.svg";
import Icon from "components/Icon";
import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";
import styles from "./filterResultBannerStyles.module.scss";
import { useMemo } from "react";
import { useWindowSize } from "hooks/useWindowSize";

function FilterResultBanner() {
    const {
        withoutFilterResponseSize,
        selectedFilterSections: selectedFilterSectionsOriginal,
        tableData,
        setSelectedFilterSections,
        resetData,
        filterSectionsConfig,
    } = useContactsListContext();

    const selectedFilterSections = selectedFilterSectionsOriginal.filter((item) => item.selectedFilterOption);

    const { width: windowWidth } = useWindowSize();
    const isMobile = windowWidth <= 784;

    const handleClearAllClick = () => {
        setSelectedFilterSections([]);
        setTimeout(() => resetData([]), 100);
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    const filterLabel = useMemo(() => {
        return selectedFilterSections
            .map((item) => {
                const section = filterSectionsConfig[item.sectionId];
                let thisItemLabel = "";
                if (section.options) {
                    const label =
                        section.options.find((item1) => item1.value === item.selectedFilterOption)?.label || "";
                    thisItemLabel = `<span>
                        ${section.heading} ${item.selectedIsOption === "is_not" ? "is not" : "is"}
                        <span style="font-weight:bold">${capitalizeFirstLetter(label)}</span>
                    </span>`;
                } else if (section.option) {
                    thisItemLabel = `<span>
                        ${section.heading} ${
                        item.selectedIsOption === "is_not" ? "is not" : "is"
                    } <span style="font-weight:bold">${capitalizeFirstLetter(section.option.label || "")}</span>
                    </span>`;
                }
                return thisItemLabel;
            })
            .join(`<span> and </span>`);
    }, [selectedFilterSections, filterSectionsConfig]);

    if (!selectedFilterSections?.length) {
        return null;
    }
    return (
        <Box className={styles.bannerContainer}>
            <Box>
                Showing {tableData?.length || 0} of {withoutFilterResponseSize || 0} contacts |
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
