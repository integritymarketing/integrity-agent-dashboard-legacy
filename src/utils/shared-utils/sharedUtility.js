import React from "react";

export const ColorOptionRender = ({
  value,
  label,
  color = [],
  selected = false,
  onClick,
}) => {
  const handleClick = (ev) => {
    onClick && onClick(ev, value);
  };
  return (
    <div
      className={`option ${selected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color?.[0]?.color,
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

export const scrollTop = () =>{
  window.scrollTo(0, 0);
}