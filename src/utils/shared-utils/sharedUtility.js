import React from "react";

export const ColorOptionRender = ({
  value,
  label,
  color,
  selected = false,
  onClick,
  filter,
  className,
}) => {
  const handleClick = (ev) => {
    onClick && onClick(ev, value);
  };
  return (
    <div
      className={`option ${selected ? "selected" : ""} ${
        filter ? className : ""
      }`}
      onClick={handleClick}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 5,
        }}
      />
      <span>{label}</span>
    </div>
  );
};

// Key_validation - Restricting input field to accept only alphabets

export const onlyAlphabets = (e) => {
  const re = /^[a-zA-Z ]*$/;
  if (!re.test(e.key)) {
    e.preventDefault();
  }
};

export const scrollTop = () => {
  window.scrollTo(0, 0);
};

export const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatUnderScorestring = (str) => {
  let value = str.charAt(0).toUpperCase() + str.slice(1);
  return value.replaceAll("_", " ");
};

export const isEmptyObj = (obj) => {
  for (let i in obj) return false;
  return true;
};
