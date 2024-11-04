import { useState, useMemo } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Icon from "components/Icon";
import styles from "./styles.module.scss";
import { Box } from "@mui/material";
import ArrowDownBlue from "components/icons/version-2/ArrowDownBlue";
import Close from "../icons/close.svg";
import { Text } from "@integritymarketing/ui-text-components";
import { useWindowSize } from "hooks/useWindowSize";
import PropTypes from "prop-types";

const IS_DROPDOWN_SELECT_OPTIONS = [
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
];

const ANDOR_DROPDOWN_SELECT_OPTIONS = [
    { value: "and", label: "and" },
    { value: "or", label: "or" },
];

export default function FilterSectionBox({
    section,
    shouldShowAndOr,
    onRemove,
    onChangeFilterOption,
    freezeAndOption,
    onChangeIsOption,
    isFilterSelectOpenForSection,
    onChangeNextAndOrOption,
    filterSectionsConfig,
}) {
    const [filterIsConditionValue, setFilterIsConditionValue] = useState(section.selectedIsOption || "is");
    const [filterValue, setFilterValue] = useState(section.selectedFilterOption);
    const [filterAndOrConditionValue, setFilterAndOrConditionValue] = useState(section.nextAndOrOption || "and");
    const [isFilterSelectOpen, setIsFilterSelectOpen] = useState(isFilterSelectOpenForSection ? true : false);
    const { width: windowWidth } = useWindowSize();
    const isMobile = windowWidth <= 784;

    const onItemClickHandle = (value) => {
        setFilterValue(value);
    };

    const onIsSelectItemClickHandle = (value) => {
        setFilterIsConditionValue(value);
    };

    const onAndOrSelectItemClickHandle = (value) => {
        setFilterAndOrConditionValue(value);
    };

    const placeholder = useMemo(() => {
        if (!filterValue) {
            return "Select..";
        }
        return "";
    }, [filterValue]);

    const configData = useMemo(() => {
        if (section && section.root) {
            const rootSection = filterSectionsConfig[section.root];
            const data = rootSection?.options?.find((item) => item.value === section.sectionId);
            return data || {};
        } else {
            return filterSectionsConfig[section.sectionId];
        }
    }, [section, filterSectionsConfig]);
    return (
        <>
            <Text className={styles.sectionHeading} text={configData?.heading} />
            <Box className={`${styles.sectionContent} ${filterValue ? "" : styles.sectionContentInline}`}>
                {filterValue && (
                    <Select
                        IconComponent={() => <ArrowDownBlue />}
                        value={filterIsConditionValue}
                        className={styles.selectBox}
                        onChange={(e) => onChangeIsOption(e.target.value)}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    borderRadius: "8px",
                                },
                            },
                        }}
                        sx={{
                            svg: {
                                pointerEvents: "none",
                                position: "absolute",
                                right: "5px",
                            },
                            color: "#434A51",
                            width: "125px",
                            height: "45px",
                            paddingRight: "5px",
                            borderColor: "#DDDDDD",
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#DDDDDD",
                            },
                            ".MuiSelect-outlined": { padding: "0px 7px", paddingRight: "0px !important" },
                            ".MuiOutlinedInput-notchedOutline": { borderColor: "#DDDDDD" },
                            ".MuiOutlinedInput-root-MuiSelect-root.Mui-disabled": { cursor: "not-allowed" },
                            "&:hover": { ".MuiOutlinedInput-notchedOutline": { borderColor: "#DDDDDD" } },
                        }}
                    >
                        {IS_DROPDOWN_SELECT_OPTIONS.map(({ value, label }) => (
                            <MenuItem
                                className={styles.menuItem}
                                value={value}
                                key={value}
                                onClick={() => onIsSelectItemClickHandle(value)}
                            >
                                <Box paddingLeft={"5px"}>
                                    <Box fontStyle={"italic"}>{label}</Box>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                )}
                {configData?.options && (
                    <Box display={"flex"} width={"80%"}>
                        <Select
                            IconComponent={() => <ArrowDownBlue />}
                            value={filterValue}
                            className={`${styles.selectBox} ${styles.selectBoxFilterValue}`}
                            open={isFilterSelectOpen}
                            onChange={(e) => onChangeFilterOption(e.target.value)}
                            onOpen={() => setIsFilterSelectOpen(true)}
                            onClose={() => setIsFilterSelectOpen(false)}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        borderRadius: "8px",
                                    },
                                },
                            }}
                            sx={{
                                "& .MuiSelect-select .notranslate::after": placeholder
                                    ? {
                                          content: `"${placeholder}"`,
                                          opacity: 0.42,
                                      }
                                    : {},
                                svg: {
                                    pointerEvents: "none",
                                    position: "absolute",
                                    right: "5px",
                                },
                                color: "#434A51",
                                width: "200px",
                                minHeight: "45px",
                                paddingRight: "5px",
                                borderColor: "#DDDDDD",
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#DDDDDD",
                                },
                                ".MuiSelect-outlined": {
                                    padding: "0px 7px",
                                    paddingRight: "0px !important",
                                    whiteSpace: "break-spaces",
                                },
                                ".MuiOutlinedInput-notchedOutline": { borderColor: "#DDDDDD" },
                                "&:hover": { ".MuiOutlinedInput-notchedOutline": { borderColor: "#DDDDDD" } },
                            }}
                        >
                            {configData?.options.map(({ value, label, color, icon, iconClassName }) => (
                                <MenuItem
                                    className={styles.menuItem}
                                    value={value}
                                    key={value}
                                    onClick={() => onItemClickHandle(value)}
                                >
                                    <Box paddingLeft={"5px"} display="flex" alignItems="center" gap="10px">
                                        {color && (
                                            <span className={styles.dot} style={{ backgroundColor: color }}></span>
                                        )}
                                        {icon && (
                                            <Icon className={`${styles.menuItemIcon} ${iconClassName}`} image={icon} />
                                        )}
                                        <Box>{label}</Box>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                        {filterValue && isMobile && (
                            <Icon
                                className={`${styles.closeIcon} ${styles.closeIconMobile}`}
                                image={Close}
                                onClick={onRemove}
                            />
                        )}
                    </Box>
                )}
                {configData?.option && (
                    <Box display={"flex"}>
                        <Box className={styles.singleOptionBox}>
                            {configData?.option.icon && (
                                <Icon className={styles.itemIcon} image={configData?.option.icon} />
                            )}
                            {configData?.option.label}
                        </Box>
                        {isMobile && (
                            <Icon
                                className={`${styles.closeIcon} ${styles.closeIconMobile}`}
                                image={Close}
                                onClick={onRemove}
                            />
                        )}
                    </Box>
                )}
                {filterValue && !isMobile && <Icon className={styles.closeIcon} image={Close} onClick={onRemove} />}
            </Box>

            {shouldShowAndOr && filterValue && (
                <Box
                    className={`${styles.sectionContent} ${styles.sectionContentInline} ${styles.sectionContentAndOr} ${
                        freezeAndOption ? styles.selectBoxDisabled : ""
                    }`}
                >
                    <Select
                        IconComponent={() => <ArrowDownBlue />}
                        disabled={freezeAndOption}
                        value={filterAndOrConditionValue}
                        className={`${styles.selectBox} ${freezeAndOption ? styles.selectBoxDisabled : ""}`}
                        onChange={(e) => onChangeNextAndOrOption(e.target.value)}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    borderRadius: "8px",
                                },
                            },
                        }}
                        sx={{
                            svg: {
                                pointerEvents: "none",
                                position: "absolute",
                                right: "5px",
                            },
                            color: "#434A51",
                            width: "100px",
                            height: "45px",
                            paddingRight: "5px",
                            borderColor: "#DDDDDD",
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#DDDDDD",
                            },
                            ".MuiSelect-outlined": { padding: "0px 7px", paddingRight: "0px !important" },
                            ".MuiOutlinedInput-notchedOutline": { borderColor: "#DDDDDD" },
                            "&:hover": { ".MuiOutlinedInput-notchedOutline": { borderColor: "#DDDDDD" } },
                        }}
                    >
                        {ANDOR_DROPDOWN_SELECT_OPTIONS.map(({ value, label }) => (
                            <MenuItem
                                className={styles.menuItem}
                                value={value}
                                key={value}
                                onClick={() => onAndOrSelectItemClickHandle(value)}
                            >
                                <Box paddingLeft={"5px"}>
                                    <Box fontStyle={"italic"}>{label}</Box>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            )}
        </>
    );
}

FilterSectionBox.propTypes = {
    section: PropTypes.shape({
        sectionId: PropTypes.string.isRequired,
        selectedIsOption: PropTypes.string,
        selectedFilterOption: PropTypes.string,
        nextAndOrOption: PropTypes.string,
        root: PropTypes.string,
    }).isRequired,
    shouldShowAndOr: PropTypes.bool,
    onRemove: PropTypes.func.isRequired,
    onChangeFilterOption: PropTypes.func.isRequired,
    freezeAndOption: PropTypes.bool,
    onChangeIsOption: PropTypes.func.isRequired,
    isFilterSelectOpenForSection: PropTypes.bool,
    onChangeNextAndOrOption: PropTypes.func.isRequired,
    filterSectionsConfig: PropTypes.object.isRequired,
};
