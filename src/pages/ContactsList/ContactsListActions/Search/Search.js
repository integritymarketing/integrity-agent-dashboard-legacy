import React from "react";
import { useCallback, useRef, useState } from "react";

import debounce from "lodash/debounce";

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

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} style={{ fontWeight: 700, color: "#000" }}>
                {part}
            </span>
        ) : (
            part
        )
    );
};

function Search() {
    const { setSearchString, tableDataFromHook, setIsStartedSearching, setTableData, setSelectedSearchLead } =
        useContactsListContext();

    const inputRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [inputValue, setInputValue] = useState("");

    const debouncedOnChangeHandle = useCallback(
        debounce((value) => {
            if (value.length >= 3) {
                setIsStartedSearching(true);
                setSearchString(value);
                setSelectedSearchLead(null);
            } else {
                handleClear();
            }
        }, 500),
        []
    );

    const onChangeHandle = (e) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedOnChangeHandle(value);
        setAnchorEl(e.currentTarget);
    };

    const getName = (_row) => {
        const name = [_row.firstName || "", _row.middleName || "", _row.lastName || ""].join(" ").trim();
        return name ? toTitleCase(name) : "--";
    };

    const leadNames = tableDataFromHook?.map((item) => ({
        optionText: getName(item),
        value: getName(item),
        icon: null,
    }));

    const handleLeadSelect = (value) => {
        setIsStartedSearching(false);
        const selectedLead = tableDataFromHook.find((item) => getName(item) === value);
        setTableData([selectedLead]);
        setSelectedSearchLead(selectedLead);
        setAnchorEl(null);
        setInputValue(value);
    };

    const handleSearch = () => {
        setAnchorEl(null);
        setIsStartedSearching(false);
    };

    const handleClear = () => {
        setSelectedSearchLead(null);
        setInputValue("");
        setSearchString("");
        setIsStartedSearching(false);
        setAnchorEl(null);
        inputRef.current?.focus();
    };

    const open = Boolean(anchorEl);
    const popperRef = useRef();

    useOnClickOutside(popperRef, () => {
        if (open) {
            handleSearch();
        }
    });

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <>
            <Textfield
                ref={inputRef}
                type="search"
                name="search"
                onKeyDown={handleKeyDown}
                value={inputValue}
                icon={<SearchBlue />}
                placeholder="Search"
                className={styles.searchInput}
                onChange={onChangeHandle}
                onBlur={() => analyticsService.fireEvent("event-search")}
                onClear={handleClear}
                autoComplete="off"
            />
            {tableDataFromHook?.length > 0 && inputValue && (
                <>
                    <Popper
                        id={open ? "simple-popper" : undefined}
                        open={open}
                        anchorEl={anchorEl}
                        placement="bottom"
                        ref={popperRef}
                    >
                        <Paper className={styles.popper}>
                            {leadNames.map((option, index) => (
                                <Box
                                    className={styles.optionItem}
                                    onClick={() => handleLeadSelect(option.value)}
                                    key={option.optionText}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "16px",
                                            color: "#434A51",
                                            marginLeft: "10px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        <HighlightedText text={option.optionText} highlight={inputValue} />
                                    </Typography>
                                </Box>
                            ))}
                        </Paper>
                    </Popper>
                </>
            )}
        </>
    );
}

export default Search;
