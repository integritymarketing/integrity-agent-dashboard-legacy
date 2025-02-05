import React, { useCallback, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import PropTypes from "prop-types";

import SearchBlue from "components/icons/version-2/SearchBlue";
import Textfield from "components/ui/textfield";
import { toTitleCase } from "utils/toTitleCase";

import analyticsService from "services/analyticsService";

import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import styles from "./styles.module.scss";

import { Box, Popper, Paper, Typography } from "@mui/material";
import { useOnClickOutside } from "hooks/useOnClickOutside";

const HighlightedText = ({ text, highlight }) => {
    if (!highlight) return text;

    const parts = text?.split(new RegExp(`(${highlight})`, "gi"));
    return parts?.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} style={{ fontWeight: 700, color: "#000" }}>
                {part}
            </span>
        ) : (
            part
        )
    );
};

HighlightedText.propTypes = {
    text: PropTypes.string.isRequired,
    highlight: PropTypes.string,
};

const Search = ({ isMobile }) => {
    const {
        setSearchString,
        searchString,
        tableDataFromHook,
        setIsStartedSearching,
        setTableData,
        setSelectedSearchLead,
        isFetchingTableData,
    } = useContactsListContext();

    const inputRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [inputValue, setInputValue] = useState("");

    // Debounced search input handler
    const debouncedOnChangeHandle = useMemo(() => {
        return debounce((value) => {
            setIsStartedSearching(true);
            setSearchString(value);
            setSelectedSearchLead(null);
        }, 1000);
    }, [setIsStartedSearching, setSearchString, setSelectedSearchLead]);

    const onChangeHandle = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim().length < 3) {
            setIsStartedSearching(false);
            setSelectedSearchLead(null);
            setAnchorEl(null);
            if (searchString?.length) {
                setSearchString("");
            }
        } else {
            debouncedOnChangeHandle(value);
        }
        setAnchorEl(e.currentTarget);
    };

    const getName = useCallback((row) => {
        const name = [row.firstName || "", row.middleName || "", row.lastName || ""].join(" ").trim();
        return name ? toTitleCase(name) : "--";
    }, []);

    const leadNames = useMemo(() => {
        if (!tableDataFromHook) return [];
        return tableDataFromHook.map((item) => ({
            optionText: getName(item),
            value: getName(item),
        }));
    }, [tableDataFromHook, getName]);

    const handleLeadSelect = (value) => {
        setIsStartedSearching(false);
        const selectedLead = tableDataFromHook.find((item) => getName(item) === value);
        setTableData(selectedLead ? [selectedLead] : []);
        setSelectedSearchLead(selectedLead || null);
        setAnchorEl(null);
        setInputValue(value);
    };

    const handleClear = () => {
        setSelectedSearchLead(null);
        setIsStartedSearching(false);
        setAnchorEl(null);
        setSearchString("");
        setInputValue("");
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleClickOutside();
        }
    };

    const handleClickOutside = () => {
        setAnchorEl(null);
        setSelectedSearchLead(null);
        setIsStartedSearching(false);
    };

    const open = Boolean(anchorEl);
    const popperRef = useRef();
    useOnClickOutside(popperRef, () => handleClickOutside());

    return (
        <Box ref={inputRef} width={isMobile ? "100%" : "35%"}>
            <Textfield
                type="search"
                name="search"
                onKeyDown={handleKeyDown}
                iconClassName={styles.clearIcon}
                value={inputValue}
                icon={<SearchBlue />}
                placeholder="Search"
                className={styles.searchInput}
                onChange={onChangeHandle}
                onBlur={() => analyticsService.fireEvent("event-search")}
                onClear={handleClear}
                isMobile={isMobile}
                autoComplete="off"
            />
            {open && inputValue.length >= 3 && (
                <Popper open={open} anchorEl={anchorEl} placement="bottom" ref={popperRef}>
                    <Paper className={styles.popper}>
                        {isFetchingTableData ? (
                            <Box className={styles.noResults}>
                                <Typography>Loading...</Typography>
                            </Box>
                        ) : (
                            <>
                                {leadNames.length > 0 ? (
                                    <>
                                        {leadNames.map((option) => (
                                            <Box
                                                key={option.optionText}
                                                className={styles.optionItem}
                                                onClick={() => handleLeadSelect(option.value)}
                                            >
                                                <Typography>
                                                    <HighlightedText text={option.optionText} highlight={inputValue} />
                                                </Typography>
                                            </Box>
                                        ))}
                                    </>
                                ) : (
                                    <Box className={styles.noResults}>
                                        <Typography>No results found</Typography>
                                    </Box>
                                )}
                            </>
                        )}
                    </Paper>
                </Popper>
            )}
        </Box>
    );
};

export default Search;
