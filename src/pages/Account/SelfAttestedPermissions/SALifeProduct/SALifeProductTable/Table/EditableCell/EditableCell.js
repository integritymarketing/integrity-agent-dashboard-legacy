import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import Textfield from "components/ui/textfield";

const EditableCell = ({ value: initialValue, row, column, updateMyData }) => {
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
        setValue(e.target.value);
    };

    const onBlur = () => {
        updateMyData(row?.original?.fexAttestationId, column?.id, value);
    };

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return <Textfield value={value} onChange={onChange} onBlur={onBlur} />;
};

EditableCell.propTypes = {
    value: PropTypes.any,
    row: PropTypes.object,
    column: PropTypes.object,
    updateMyData: PropTypes.func,
};

export default EditableCell;
