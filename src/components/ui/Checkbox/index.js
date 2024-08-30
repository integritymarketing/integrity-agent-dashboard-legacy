import PropTypes from "prop-types";
import styles from "./styles.module.scss";

function Checkbox({
    htmlFor = "",
    id = "",
    name = "",
    value = "",
    label = "",
    className = "",
    onChange,
    checked = false,
    disabled = false,
    defaultChecked = false,
}) {
    const theClassName = `${styles.checkboxLabel} ${className} ${disabled ? styles.disabled : ""}`;

    return (
        <label htmlFor={htmlFor} className={theClassName}>
            <input
                type="checkbox"
                className="mr-1"
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                checked={checked}
                defaultChecked={defaultChecked}
            />
            {label}
        </label>
    );
}

Checkbox.propTypes = {
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

export default Checkbox;
