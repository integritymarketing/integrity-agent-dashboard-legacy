import React, { useState, useCallback } from "react";
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
    initialValue = 10000,
    min = 0,
    max = 100000,
    incrementOrDecrementValue = 10000,
    onValueChange,
    currencySymbol = "$",
    inputStyles = {},
}) => {
    const [value, setValue] = useState(initialValue);

    const handleIncrement = useCallback(() => {
        setValue((prevValue) => {
            const newValue = Math.min(prevValue + incrementOrDecrementValue, max);

            if (onValueChange) {
                onValueChange(newValue);
            } // Notify parent

            return newValue;
        });
    }, [max, onValueChange, incrementOrDecrementValue]);

    const handleDecrement = useCallback(() => {
        setValue((prevValue) => {
            const newValue = Math.max(prevValue - incrementOrDecrementValue, min);

            if (onValueChange) {
                onValueChange(newValue);
            } // Notify parent

            return newValue;
        });
    }, [min, onValueChange, incrementOrDecrementValue]);

    const handleInputChange = (event) => {
        const inputValue = event.target.value.replace(/[^0-9]/g, "");
        const numericValue = inputValue ? parseInt(inputValue, 10) : 0;


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
                disabled={value <= min}
            >
                <RemoveIcon />
            </IconButton>
            <TextField
                variant="outlined"
                value={(currencySymbol ? currencySymbol : "") + value.toLocaleString()}
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
                disabled={value >= max}
            >
                <AddIcon />
            </IconButton>
        </Stack>
    );
};

CounterInput.propTypes = {
    initialValue: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    onValueChange: PropTypes.func,
    currencySymbol: PropTypes.string,
    inputStyles: PropTypes.object,
    incrementOrDecrementValue: PropTypes.number,
};

export default React.memo(CounterInput);
