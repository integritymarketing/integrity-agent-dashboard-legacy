import { useEffect, useState } from "react";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import Textfield from "components/ui/textfield";

import styles from "../styles.module.scss";

const EditableCell = ({ value: initialValue, row, column, updateMyData, validate, setInvalidProducerId }) => {
    const [error, setError] = useState(null);
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
        setValue(e.target.value);
    };

    const validateInput = (input) => {
        if (input.length < 8 || input.length > 13) {
            return "Input must be between 8 and 13 characters long.";
        }
        return null;
    };

    const onBlur = () => {
        updateMyData(row?.original?.fexAttestationId, column?.id, value);
    };

    useEffect(() => {
        setValue(initialValue);
        const validatedError = validate ? validateInput(initialValue) : null;
        if (validatedError) {
            setError(validatedError);
            setInvalidProducerId(true);
        } else {
            setError(null);
            setInvalidProducerId(false);
        }
    }, [initialValue, setInvalidProducerId, validate]);

    return (
        <>
            <Textfield
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={error ? true : false}
                hideFieldError={true}
            />
            {error && <Box className={styles.errorMessage}>{error}</Box>}
        </>
    );
};

EditableCell.propTypes = {
    value: PropTypes.any,
    row: PropTypes.object,
    column: PropTypes.object,
    updateMyData: PropTypes.func,
    validate: PropTypes.bool,
    setInvalidProducerId: PropTypes.func,
};

export default EditableCell;
