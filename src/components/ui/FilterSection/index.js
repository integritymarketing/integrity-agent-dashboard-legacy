import React from "react";
import "./filterSection.scss";

const FilterSection = ({ children }) => {
  return <div className="section">{children}</div>;
};
export default FilterSection;

export const SubSection = ({ title = "", children }) => {
  return (
    <div className="subSection">
      {title && <div className="title">{title}</div>}
      {children}
    </div>
  );
};
