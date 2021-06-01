import React, { useState, useMemo, useEffect, useRef } from "react";

import PropTypes from "prop-types";

import ArrowDownIcon from "../../icons/arrow-down";
import "./select.scss";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";

export const DefaultOption = ({ label, value, prefix = '', onClick, selected = false, ...rest }) => {
  const handleOptionClick = (ev) => {
    onClick && onClick(ev, value);
  };

  return (
    <div {...rest} className={`option ${selected ? 'selected' : ''}`} onClick={handleOptionClick}>
      {prefix}{label}
    </div>
  );
};

DefaultOption.propTypes = {
  label: PropTypes.string,
  selected: PropTypes.bool,
  value: PropTypes.any,
  onClick: PropTypes.func,
  style: PropTypes.object,
  prefix: PropTypes.string
};

export const Select = ({
  initialValue,
  mobileLabel = null,
  options,
  Option,
  onChange,
  placeholder,
  prefix = '',
  style,
  contactsPage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(initialValue);
  const ref = useRef();

  const { height: windowHeight } = useWindowSize();

  useOnClickOutside(ref, () => setIsOpen(false));

  useEffect(() => {
    setValue(initialValue);
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
    const selectableOptions = options.map(
      (option) => ({ ...option, selected: option?.value === value })
    );
    return [selectedOptions[0], selectableOptions];
  }, [options, value]);

  const heightStyle = useMemo(() => {
    const top = isOpen ? ref.current.getBoundingClientRect().top + 40 : 40;
    return windowHeight
    ? {
      maxHeight: Math.max(
        Math.min(windowHeight - top, (selectableOptions.length + 1) * 40),
        Math.min(selectableOptions.length + 1, 3) * 40
      ),
    }
    : {
      maxHeight: 0
    };
  }, [selectableOptions.length, isOpen, windowHeight]);

  const inputBox = (
    <div className="inputbox" onClick={toggleOptionsMenu}>
      {value ? (
        <Option prefix={prefix} {...selectedOption} />
      ) : (
        <span className="placeholder">{placeholder}</span>
      )}
      <ArrowDownIcon />
    </div>
  );
  const selectBox = (
    <div className="selectbox" onClick={toggleOptionsMenu}>
      {mobileLabel}
    </div>
  )
  const selectHeader = (
    <div className="select-header">
      <div className="prefix">{placeholder}</div>
      <button onClick={toggleOptionsMenu}>&times;</button>
    </div>
  )
  const optionsContainer = (
    <div className="options" style={{ maxHeight: heightStyle.maxHeight - 40 }}>
      {selectHeader}
      {selectableOptions.map((option, idx) => (
        <Option key={idx} {...option} onClick={handleOptionChange} />
      ))}
    </div>
  );

  return (
    <div ref={ref} style={style} className={`select ${contactsPage && 'contacts-dd'}`}>
      <div
        className={`select-container ${isOpen ? "opened" : "closed"}`}
        style={heightStyle}
      >
        {inputBox}
        {selectBox}
        {isOpen && optionsContainer}
      </div>
    </div>
  );
};

Select.propTypes = {
  initialValue: PropTypes.string,
  prefix: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  Option: PropTypes.elementType,
  style: PropTypes.object,
  mobileLabel: PropTypes.node,
};

Select.defaultProps = {
  placeholder: "- Select -",
  prefix: "",
  initialValue: null,
  options: [],
  Option: DefaultOption,
  style: {},
};
