import React, { useState, useRef } from "react";
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

  const openClass = isOpen ? "opened" : "closed";

  return (
    <div ref={ref} className={`action-dropdown ${openClass}`}>
      <div onClick={toggleDropdownMenu} className={`${openClass} ${className}`}>
        {children}
      </div>
      <div className="action-dropdown-menu">
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
