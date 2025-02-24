import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    Autocomplete,
    TextField,
    Typography,
    InputAdornment,
    Stack,
    ListItem,
    ListItemText,
    CircularProgress,
    Box,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import SearchBlue from "components/icons/version-2/SearchBlue";
import styles from "./styles.module.scss";

const SearchField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
        backgroundColor: "white",
        borderRadius: "8px",
        height: "48px",
    },
});

function HealthConditionSearchSection({
    title = "",
    placeholder = "",
    onChange = () => {},
    value = "",
    conditions = [],
    handleSelect = () => {},
    loading = false,
    loaded = false,
}) {
    const renderAutocompleteOption = (props, option) => {
        return (
            <ListItem onClick={() => handleSelect(option)} className={styles.listItem}>
                <ListItemText
                    primary={
                        <Typography color={"#434A51"} variant="subtitle1">
                            {option.name || option.conditionName}
                        </Typography>
                    }
                    sx={{
                        cursor: "pointer",
                    }}
                />
            </ListItem>
        );
    };

    return (
        <Stack direction="column" gap={"4px"}>
            <Typography variant="h4" sx={{ color: "#052A63" }}>
                {title}
            </Typography>
            <Autocomplete
                freeSolo
                blurOnSelect={true}
                options={conditions}
                getOptionLabel={(option) => option.name || option.conditionName || ""}
                renderOption={renderAutocompleteOption}
                inputValue={value}
                onInputChange={(e, value) => onChange(value)}
                renderInput={(params) => (
                    <SearchField
                        {...params}
                        fullWidth
                        placeholder={placeholder}
                        helperText={loaded && conditions.length === 0 ? "0 conditions found" : ""}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? (
                                        <Box className={styles.flexAlignCenter}>
                                            <CircularProgress color="inherit" size={20} />
                                        </Box>
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchBlue color="#6B7280" size={20} />
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
            />
        </Stack>
    );
}

HealthConditionSearchSection.propTypes = {
    title: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    conditions: PropTypes.array,
    loaded: PropTypes.bool,
};

export default HealthConditionSearchSection;
