
import React from 'react'

export const ColorOptionRender = ({ value, label, color, onClick }) => {
  const handleClick = (ev) => {
    onClick && onClick(ev, value);
  };
  return (
    <div className="option" onClick={handleClick}>
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
