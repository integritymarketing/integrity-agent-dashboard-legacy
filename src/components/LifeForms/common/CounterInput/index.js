import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { TextField, IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

/**
 * CounterInput component allows the user to increment, decrement, or enter a value directly.
 * Notifies the parent component of value changes via the onValueChange prop.
 * Supports dynamic currency symbols.
 */

const CounterInput = ({
    initialValue = 2000,
    min = 0,
    max = 100000,
    incrementOrDecrementValue = 10000,
    initialIncrementValue = 2000,
    onValueChange,
    currencySymbol = "$",
    inputStyles = {},
}) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleIncrement = useCallback(() => {
        setValue((prevValue) => {
            const numericValue = prevValue === "" ? 0 : prevValue;
            const newValue = Math.min(numericValue + incrementOrDecrementValue, max);
            if (prevValue >= min) {
                if (onValueChange) {
                    onValueChange(newValue);
                }
                return newValue;
            } else {
                if (onValueChange) {
                    onValueChange(initialIncrementValue);
                }
                return initialIncrementValue;
            }
        });
    }, [max, onValueChange, incrementOrDecrementValue]);

    const handleDecrement = useCallback(() => {
        setValue((prevValue) => {
            const numericValue = prevValue === "" ? 0 : prevValue;
            const newValue = Math.max(numericValue - incrementOrDecrementValue, min);

            if (onValueChange) {
                onValueChange(newValue);
            }

            return newValue;
        });
    }, [min, onValueChange, incrementOrDecrementValue]);

    const handleInputChange = (event) => {
        const inputValue = event.target.value.replace(/[^0-9]/g, "");
        const numericValue = inputValue === "" ? "" : parseInt(inputValue, 10);

        setValue(numericValue);

        if (onValueChange) {
            onValueChange(numericValue);
        }
    };

    return (
        <Stack direction="row" spacing={1}>
            <IconButton
                sx={{
                    backgroundColor: "#F1FAFF",
                    alignSelf: "center",
                    "&.Mui-disabled": {
                        backgroundColor: "#F1F1F1",
                    },
                    "&:hover": {
                        backgroundColor: "#F1FAFF",
                    },
                }}
                onClick={handleDecrement}
                disabled={value === "" || value <= min}
            >
                <RemoveIcon sx={{ fill: "#4178FF" }} />
            </IconButton>
            <TextField
                size="medium"
                variant="outlined"
                value={value === 0 ? "" : (currencySymbol ? currencySymbol : "") + value.toLocaleString()}
                onChange={handleInputChange}
                inputProps={{ style: { ...inputStyles, textAlign: "center" } }}
                fullWidth
            />
            <IconButton
                sx={{
                    backgroundColor: "#F1FAFF",
                    alignSelf: "center",
                    "& .Mui-disabled": {
                        backgroundColor: "#F1F1F1",
                    },
                    "&:hover": {
                        backgroundColor: "#F1FAFF",
                    },
                }}
                onClick={handleIncrement}
                disabled={value !== "" && value >= max}
            >
                <AddIcon sx={{ fill: "#4178FF" }} />
            </IconButton>
        </Stack>
    );
};

CounterInput.propTypes = {
    initialValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    min: PropTypes.number,
    max: PropTypes.number,
    incrementOrDecrementValue: PropTypes.number,
    initialIncrementValue: PropTypes.number,
    onValueChange: PropTypes.func,
    currencySymbol: PropTypes.string,
    inputStyles: PropTypes.object,
};

export default React.memo(CounterInput);
