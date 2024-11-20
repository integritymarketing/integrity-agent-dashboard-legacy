import React, { useState, useCallback, useRef } from "react";
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
    const [value, setValue] = useState(initialValue);
    const firstIncrement = useRef(true);

    const handleIncrement = useCallback(() => {
        setValue((prevValue) => {
            const incrementValue = firstIncrement.current ? initialIncrementValue : incrementOrDecrementValue;
            const numericValue = prevValue === "" ? 0 : prevValue;
            const newValue = Math.min(numericValue + incrementValue, max);

            if (onValueChange) {
                onValueChange(newValue);
            } // Notify parent

            firstIncrement.current = false;
            return newValue;
        });
    }, [max, onValueChange, incrementOrDecrementValue, initialIncrementValue]);

    const handleDecrement = useCallback(() => {
        setValue((prevValue) => {
            const decrementValue = firstIncrement.current ? initialIncrementValue : incrementOrDecrementValue;
            const numericValue = prevValue === "" ? 0 : prevValue;
            const newValue = Math.max(numericValue - decrementValue, min);

            if (onValueChange) {
                onValueChange(newValue);
            } // Notify parent

            firstIncrement.current = false;
            return newValue;
        });
    }, [min, onValueChange, incrementOrDecrementValue, initialIncrementValue]);

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
                }}
                onClick={handleDecrement}
                disabled={value === "" || value <= min}
            >
                <RemoveIcon />
            </IconButton>
            <TextField
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
                }}
                onClick={handleIncrement}
                disabled={value !== "" && value >= max}
            >
                <AddIcon />
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