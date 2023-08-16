import React, { useState } from "react";
import { Popover as TinyPopover, ArrowContainer } from "react-tiny-popover";
import "./index.scss";
export default function Popover({
  children,
  openOn,
  title,
  icon,
  footer,
  description,
  closeWhenClickOutside,
  isPolicyList,
  ...rest
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const handleOnClick = () => {
    if (openOn === "click") {
      setIsPopoverOpen(true);
    }
  };
  const handleOnHover = () => {
    if (openOn === "hover") {
      setIsPopoverOpen(true);
    }
  };
  const onClickOutside = () => {
    if (closeWhenClickOutside) {
      setIsPopoverOpen(false);
    }
  };

  const handlePopoverClose = () => {
    if (openOn === "hover") {
      setIsPopoverOpen(false);
    }
  };
  return (
    <TinyPopover
      {...rest}
      isOpen={isPopoverOpen}
      onClickOutside={onClickOutside}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor={"#2B323B"}
          arrowSize={10}
          className="popover-arrow-container"
          arrowClassName="popover-arrow"
        >
          <div
            className={`popover-content ${isPolicyList ? "customSize" : ""}`}
          >
            <div className="popover-title">
              {icon}
              {title}
            </div>
            <div className="popover-description">{description}</div>
            {footer && <div className="popover-footer">{footer}</div>}
          </div>
        </ArrowContainer>
      )}
    >
      <div
        className="popover-action-handler"
        onClick={handleOnClick}
        onMouseOver={handleOnHover}
        onMouseLeave={handlePopoverClose}
      >
        {children}
      </div>
    </TinyPopover>
  );
}

Popover.defaultProps = {
  icon: null,
  openOn: "click",
  title: null,
  positions: ["top", "right", "left", "bottom"],
  padding: 10,
  closeWhenClickOutside: true,
};
