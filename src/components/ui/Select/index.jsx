import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { useSelectFilterToScroll } from "hooks/useSelectFilter";
import Arrow from "components/icons/down";
import "./select.scss";

export const DefaultOption = ({ label, value, prefix = "", onClick, selected = false, showValueAsLabel, ...rest }) => {
    const handleOptionClick = (ev) => {
        if (onClick) {
            onClick(ev, value);
        }
    };

    return (
        <div
            {...rest}
            className={`option ${selected ? "selected" : ""}`}
            onClick={handleOptionClick}
            id={`option-${label}`}
            tabIndex="-1"
            role="menuitem"
        >
            {prefix}
            {showValueAsLabel ? value : label}
        </div>
    );
};

DefaultOption.propTypes = {
    label: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    prefix: PropTypes.string,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    showValueAsLabel: PropTypes.bool,
};

export const Select = ({
    initialValue,
    selectContainerClassName = "",
    mobileLabel = null,
    inputBoxClassName = "",
    options,
    Option,
    onBlur,
    onChange,
    placeholder,
    prefix = "",
    labelPrefix = "",
    style,
    contactsPage,
    showValueAsLabel = false,
    isDefaultOpen = false,
    disabled,
    providerModal,
    showValueAlways = false,
    error,
    containerHeight = 0,
    page = "",
    selectClassName = "",
    showEmptyOption = false,
}) => {
    const [isOpen, setIsOpen] = useState(isDefaultOpen);
    const [value, setValue] = useState(initialValue);
    const ref = useRef();

    const { height: windowHeight } = useWindowSize();

    useOnClickOutside(ref, () => {
        if (isOpen) {
            setIsOpen(false);
            if (onBlur) {
                onBlur();
            }
        }
    });

    useSelectFilterToScroll(options, isOpen, (label) => {
        scrollToOption(label);
    });

    const scrollToOption = (label) => {
        if (label) {
            const filtered = options.filter((state) => {
                return state.label.toLowerCase().startsWith(label?.toLowerCase());
            });
            const filtered_label = filtered[0]?.label;
            const filtered_value = filtered[0]?.value;

            const selectedElement = document.getElementById(`option-${filtered_label}`);
            selectedElement.classList.add("active-item-selected");
            const topPos = selectedElement?.offsetTop;
            const scrollContainer = document.getElementById("option-container-scrolling_div");
            scrollContainer.scrollTop = topPos - 40;
            setValue(filtered_value);
            onChange(filtered_value);
            setIsOpen(true);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setValue(initialValue);
            setIsOpen(isDefaultOpen);
        }
    }, [initialValue, isDefaultOpen]);

    const handleOptionChange = (ev, value) => {
        ev.preventDefault();
        setValue(value);
        if (onChange) {
            onChange(value);
        }
        toggleOptionsMenu();
    };

    const toggleOptionsMenu = (ev) => {
        if (ev) {
            ev.preventDefault();
        }
        setIsOpen((prevIsOpen) => {
            const newIsOpen = !prevIsOpen && !disabled;
            return newIsOpen;
        });
        if (isOpen) {
            onBlur?.();
        }
    };

    const toggleOptionsMenuKeyUp = (ev) => {
        if (ev.keyCode === 13) {
            toggleOptionsMenu(ev);
        }
    };

    const [selectedOption, memoizedSelectableOptions] = useMemo(() => {
        const selectedOptions = options.filter((option) => option?.value === value);
        const memoizedSelectableOptionsList = options.map((option) => ({
            ...option,
            selected: option?.value === value,
        }));
        return [selectedOptions[0], memoizedSelectableOptionsList];
    }, [options, value]);

    const heightStyle = useMemo(() => {
        const top = isOpen ? ref?.current?.getBoundingClientRect().top + 40 : 40;
        return containerHeight || windowHeight
            ? {
                maxHeight:
                    containerHeight ||
                    Math.max(
                        Math.min(windowHeight - top, (memoizedSelectableOptions.length + 1) * 40),
                        Math.min(memoizedSelectableOptions.length + 1, 3) * 40,
                    ) + 2,
            }
            : {
                maxHeight: 0,
            };
    }, [memoizedSelectableOptions.length, isOpen, containerHeight, windowHeight]);

    const inputBox = (
        <div
            className={`${error ? "has-error" : ""} ${showValueAlways ? "show-always" : ""
                } inputbox ${inputBoxClassName}`}
            tabIndex="0"
            role="menu"
            onClick={toggleOptionsMenu}
            onKeyUp={toggleOptionsMenuKeyUp}
        >
            {value || (showEmptyOption && value == "") ? (
                <Option prefix={prefix} {...selectedOption} showValueAsLabel={showValueAsLabel} />
            ) : (
                <span className={`placeholder ${disabled && "disabled"}`}>{placeholder}</span>
            )}
            <Arrow color={"#0052CE"} />
        </div>
    );
    const selectBox = mobileLabel ? (
        <div className="selectbox" onClick={toggleOptionsMenu}>
            {mobileLabel}
        </div>
    ) : null;
    const selectHeader = (
        <div className="select-header">
            <div className="prefix">{placeholder}</div>
            <button onClick={toggleOptionsMenu}>&times;</button>
        </div>
    );
    const optionsContainer = (
        <div
            id={"option-container-scrolling_div"}
            className="options"
            style={{ maxHeight: heightStyle.maxHeight - 40 }}
        >
            {selectHeader}
            {memoizedSelectableOptions.map((option, idx) => (
                <Option prefix={labelPrefix} key={idx} {...option} onClick={handleOptionChange} />
            ))}
        </div>
    );

    return (
        <div
            ref={ref}
            style={style}
            className={`select ${contactsPage && "contacts-dd"} ${providerModal && "pr-select"} ${!isOpen && showValueAsLabel && page !== "editDetails" ? "short-label" : ""
                } ${selectContainerClassName}`}
        >
            <div
                className={`select-container ${isOpen ? "opened" : "closed"} ${disabled ? "disabled" : ""
                    } ${selectClassName}`}
                style={heightStyle}
            >
                {inputBox}
                {selectBox}
                {isOpen && !disabled && optionsContainer}
            </div>
        </div>
    );
};

Select.propTypes = {
    initialValue: PropTypes.any,
    selectContainerClassName: PropTypes.string,
    mobileLabel: PropTypes.node,
    inputBoxClassName: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.any.isRequired,
            value: PropTypes.any.isRequired,
            selected: PropTypes.bool,
        }),
    ).isRequired,
    Option: PropTypes.elementType,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    prefix: PropTypes.string,
    labelPrefix: PropTypes.string,
    style: PropTypes.object,
    contactsPage: PropTypes.bool,
    showValueAsLabel: PropTypes.bool,
    isDefaultOpen: PropTypes.bool,
    disabled: PropTypes.bool,
    providerModal: PropTypes.bool,
    showValueAlways: PropTypes.bool,
    error: PropTypes.bool,
    containerHeight: PropTypes.number,
    page: PropTypes.string,
    selectClassName: PropTypes.string,
    showEmptyOption: PropTypes.bool,
};

Select.defaultProps = {
    placeholder: "- Select -",
    prefix: "",
    initialValue: null,
    options: [],
    Option: DefaultOption,
    style: {},
    isDefaultOpen: false,
    disabled: false,
    onBlur: () => { },
    error: false,
    showEmptyOption: false,
};

export default Select;
