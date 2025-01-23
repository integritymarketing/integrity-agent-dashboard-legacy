import PropTypes from "prop-types";

import Checkbox from "../Checkbox";
import "./checkboxGroup.scss";

const checkboxProps = {
    htmlFor: PropTypes.string,
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    defaultChecked: PropTypes.bool,
};

function CheckboxGroup({ checkboxes }) {
    return (
        <div className="checkbox-group">
            {checkboxes.map((box) => (
                <Checkbox key={box.id} disabled={box.disabled} onChange={(event) => box.onChange(event)} {...box} />
            ))}
        </div>
    );
}

CheckboxGroup.propTypes = {
    checkboxes: PropTypes.arrayOf(PropTypes.shape(checkboxProps)).isRequired,
};

export default CheckboxGroup;
