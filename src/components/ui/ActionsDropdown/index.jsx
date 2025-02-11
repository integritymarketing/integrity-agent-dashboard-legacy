import React, { useState, useRef, useMemo } from "react";
import "./actionDropdown.scss";
import analyticsService from "services/analyticsService";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";

export default function ActionsDropDown({
  options,
  children,
  onClick,
  id,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const handlerElemRef = useRef();

  useOnClickOutside(ref, () => setIsOpen(false));

  const handleOptionClick = (ev, value) => {
    ev.preventDefault();
    onClick && onClick(value, id);
    analyticsService.fireEvent("event-modal-appear", {
      event: "option_selection",
      optionSelection: [value],
    });
    toggleDropdownMenu();
  };

  const toggleDropdownMenu = (ev) => {
    ev && ev.preventDefault();
    setIsOpen((isOpen) => !isOpen);
  };

  const dropDownStyles = useMemo(() => {
    if (isOpen)
      return handlerElemRef?.current
        ? {
            right:
              window.innerWidth -
                handlerElemRef?.current?.getBoundingClientRect()?.right ?? 0,
          }
        : {};
  }, [isOpen, handlerElemRef]);

  const openClass = isOpen ? "opened" : "closed";

  return (
    <div ref={ref} className={`action-dropdown ${openClass}`}>
      <div
        ref={handlerElemRef}
        onClick={toggleDropdownMenu}
        className={`${openClass} ${className}`}
      >
        {children}
      </div>
      <div className="action-dropdown-menu" style={dropDownStyles}>
        {options.map((option) => (
          <div
            className="action-dropdown-menu-item"
            key={option.value}
            onClick={(ev) => handleOptionClick(ev, option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}
