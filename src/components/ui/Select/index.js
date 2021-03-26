import React, { useState, useMemo, useEffect, useRef } from "react";

import PropTypes from "prop-types";

import ArrowDownIcon from "../../icons/arrow-down";
import "./select.scss";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";

// Default Option renderer
export const DefaultOption = ({ label, value, onClick, ...rest }) => {
  const handleOptionClick = (ev) => {
    onClick && onClick(ev, value);
  };

  return (
    <div {...rest} className="option" onClick={handleOptionClick}>
      {label}
    </div>
  );
};

DefaultOption.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  onClick: PropTypes.func,
  style: PropTypes.object,
};

export const Select = ({
  initialValue,
  options,
  Option,
  onChange,
  placeholder,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(initialValue);
  const ref = useRef();

  const { height: windowHeight } = useWindowSize();

  useOnClickOutside(ref, () => setIsOpen(false))

  useEffect(() => {
    setValue(value);
  }, [initialValue]);

  const handleOptionChange = (ev, value) => {
    ev.preventDefault();
    setValue(value);
    onChange && onChange(value);
    toggleOptionsMenu();
  };

  const toggleOptionsMenu = (ev) => {
    ev && ev.preventDefault();
    setIsOpen((isOption) => !isOption);
  };

  const [selectedOption, selectableOptions] = useMemo(() => {
    const selectedOptions = options.filter((option) => option?.value === value);
    const selectableOptions = options.filter(
      (option) => option?.value !== value
    );
    return [selectedOptions[0], selectableOptions];
  }, [options, value]);

  const heightStyle = useMemo(() => {
    const top = isOpen ? ref.current.getBoundingClientRect().top + 40 : 40;
    return {
      maxHeight: Math.max(
        Math.min(
        windowHeight - top,
        (selectableOptions.length + 1) * 40
      ), Math.min(selectableOptions.length + 1, 3) * 40),
    };
  }, [selectableOptions.length, isOpen]);

  const inputBox = (
    <div className="inputbox" onClick={toggleOptionsMenu}>
      {value ? (
        <Option {...selectedOption} />
      ) : (
        <span className="placeholder">{placeholder}</span>
      )}
      <ArrowDownIcon />
    </div>
  );

  const optionsContainer = (
    <div className="options" style={{ maxHeight: heightStyle.maxHeight - 40 }}>
      {" "}
      {selectableOptions.map((option, idx) => (
        <Option key={idx} {...option} onClick={handleOptionChange} />
      ))}
    </div>
  );

  return (
    <div ref={ref} style={style} className="select">
      <div
        className={`select-container ${isOpen ? "opened" : "closed"}`}
        style={heightStyle}
      >
        {inputBox}
        {isOpen && optionsContainer}
      </div>
    </div>
  );
};

Select.propTypes = {
  initialValue: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  Option: PropTypes.elementType,
  style: PropTypes.object,
};

Select.defaultProps = {
  placeholder: "- Select -",
  initialValue: null,
  options: [],
  Option: DefaultOption, // Default option renderer
  style: {},
};
