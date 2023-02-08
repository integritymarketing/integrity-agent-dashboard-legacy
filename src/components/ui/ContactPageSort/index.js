import React, { useState, useMemo, useEffect, useRef } from "react";

import PropTypes from "prop-types";

import ContactSort from "components/icons/contact-sort";
import "./contactPageSort.scss";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { useSelectFilterToScroll } from "hooks/useSelectFilter";

export const DefaultOption = ({
  label,
  value,
  prefix = "",
  onClick,
  selected = false,
  showValueAsLabel,
  ...rest
}) => {
  const handleOptionClick = (ev) => {
    onClick && onClick(ev, value);
  };

  return (
    <div
      {...rest}
      className={`option ${selected ? "selected" : ""}`}
      onClick={handleOptionClick}
      id={`option-${label}`}
      tabIndex="-1"
      rules="menuitem"
    >
      {prefix}
      {showValueAsLabel ? value : label}
    </div>
  );
};

DefaultOption.propTypes = {
  label: PropTypes.string,
  selected: PropTypes.bool,
  value: PropTypes.any,
  onClick: PropTypes.func,
  style: PropTypes.object,
  prefix: PropTypes.string,
};

export const ContactPageSort = ({
  initialValue,
  mobileLabel = null,
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
}) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);
  const [value, setValue] = useState(initialValue);
  const ref = useRef();

  const { height: windowHeight } = useWindowSize();

  useOnClickOutside(ref, () => {
    setIsOpen(false);
    if (isOpen) {
      onBlur && onBlur();
    }
  });

  useSelectFilterToScroll(options, isOpen, (label) => {
    scrollToOption(label);
  });

  const scrollToOption = (label) => {
    if (label) {
      let filtered = options.filter((state) => {
        return state.label.toLowerCase().startsWith(label?.toLowerCase());
      });
      let filtered_label = filtered[0]?.label;
      let filtered_value = filtered[0]?.value;

      let selectedElement = document.getElementById(`option-${filtered_label}`);
      selectedElement.classList.add("active-item-selected");
      let topPos = selectedElement?.offsetTop;
      let scrollContainer = document.getElementById(
        "option-container-scrolling_div"
      );
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
  }, [initialValue, isDefaultOpen, isOpen]);

  const handleOptionChange = (ev, value) => {
    ev.preventDefault();
    setValue(value);
    onChange && onChange(value);
    toggleOptionsMenu();
  };

  const toggleOptionsMenu = (ev) => {
    ev && ev.preventDefault();
    setIsOpen((isOpen) => !isOpen && !disabled);
    if (isOpen) {
      onBlur && onBlur();
    }
  };

  const toggleOptionsMenuKeyUp = (ev) => {
    if (ev.keyCode === 13) {
      toggleOptionsMenu(ev);
    }
  };

  const [selectedOption, selectableOptions] = useMemo(() => {
    const selectedOptions = options.filter((option) => option?.value === value);
    const selectableOptions = options.map((option) => ({
      ...option,
      selected: option?.value === value,
    }));
    return [selectedOptions[0], selectableOptions];
  }, [options, value]);

  const heightStyle = useMemo(() => {
    const top = isOpen ? ref?.current?.getBoundingClientRect().top + 40 : 40;
    return containerHeight || windowHeight
      ? {
          maxHeight:
            containerHeight ||
            Math.max(
              Math.min(windowHeight - top, (selectableOptions.length + 1) * 40),
              Math.min(selectableOptions.length + 1, 3) * 40
            ) + 2,
        }
      : {
          maxHeight: 0,
        };
  }, [selectableOptions.length, isOpen, containerHeight, windowHeight]);

  const inputBox = (
    <div
      className={`${error ? "has-error" : ""} ${
        showValueAlways ? "show-always" : ""
      } inputbox`}
      tabIndex="0"
      role="menu"
      onClick={toggleOptionsMenu}
      onKeyUp={toggleOptionsMenuKeyUp}
    >
      {value ? (
        <Option
          className="selectOption"
          {...selectedOption}
          showValueAsLabel={showValueAsLabel}
          prefix={<ContactSort />}
        />
      ) : (
        <span className="placeholder">{placeholder}</span>
      )}
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
      <button className="close-btn" onClick={toggleOptionsMenu}>
        &times;
      </button>
    </div>
  );
  const optionsContainer = (
    <div
      id={"option-container-scrolling_div"}
      className="options"
      style={{ maxHeight: heightStyle.maxHeight - 40 }}
    >
      {selectHeader}
      {selectableOptions.map((option, idx) => (
        <Option
          prefix={labelPrefix}
          key={idx}
          {...option}
          onClick={handleOptionChange}
        />
      ))}
    </div>
  );

  return (
    <div
      ref={ref}
      style={style}
      className={`select-2 ${contactsPage && "contacts-dd"} ${
        providerModal && "pr-select"
      } ${!isOpen && showValueAsLabel ? "short-label" : ""}`}
    >
      <div
        className={`select-container-2 ${isOpen ? "opened" : "closed"} ${
          disabled ? "disabled" : ""
        }`}
      >
        {inputBox}
        {selectBox}
        {isOpen && !disabled && optionsContainer}
      </div>
    </div>
  );
};

ContactPageSort.propTypes = {
  initialValue: PropTypes.string,
  prefix: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  Option: PropTypes.elementType,
  style: PropTypes.object,
  mobileLabel: PropTypes.node,
  isDefaultOpen: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
};

ContactPageSort.defaultProps = {
  placeholder: "- Select -",
  prefix: "",
  initialValue: null,
  options: [],
  Option: DefaultOption,
  style: {},
  isDefaultOpen: false,
  disabled: false,
  onBlur: () => {},
  error: false,
};
