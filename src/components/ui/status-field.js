import React from "react";

export const STATUS_NEGATIVE = Symbol();
export const STATUS_NEUTRAL = Symbol();
export const STATUS_POSITIVE = Symbol();

const STATUS_CLASSES = new Map([
  [STATUS_NEGATIVE, "status-field--negative"],
  [STATUS_NEUTRAL, "status-field--neutral"],
  [STATUS_POSITIVE, "status-field--positive"],
]);

export default ({ status = STATUS_NEUTRAL, className = "", ...props }) => {
  const statusClass = STATUS_CLASSES.get(status);
  return (
    <span
      className={`status-field ${statusClass} ${className}`}
      {...props}
    ></span>
  );
};
