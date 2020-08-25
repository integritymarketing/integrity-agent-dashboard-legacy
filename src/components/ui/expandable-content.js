import React, { useState } from "react";
import ExpandIcon from "components/icons/expand";
import CollapseIcon from "components/icons/collapse";

export default ({ header, sections = [], ...props }) => {
  const [expandedItems, setExpandedItems] = useState([]);
  const isExpanded = sections.length === expandedItems.length;
  const renderProps = {
    isExpanded,
    toggleAll: () =>
      setExpandedItems(isExpanded ? [] : sections.map(({ title }) => title)),
  };

  const toggleItem = (item, show) => {
    if (show) {
      setExpandedItems([...expandedItems, item.title]);
    } else {
      setExpandedItems(expandedItems.filter((title) => title !== item.title));
    }
  };
  return (
    <React.Fragment>
      {header && header(renderProps)}
      <ul className="mt-2">
        {sections.map((item, idx) => {
          const itemVisible = expandedItems.includes(item.title);
          const Icon = itemVisible ? CollapseIcon : ExpandIcon;
          const collapsedClasses =
            idx === sections.length - 1
              ? ""
              : "mb-scale-2 pb-scale-2 border-bottom border-bottom--light";

          return (
            <li
              key={item.title}
              className={itemVisible ? null : collapsedClasses}
            >
              <div className="toolbar text-main">
                <span className="hdg hdg--4">
                  <span className="mr-1">{item.title}</span>{" "}
                  <span className="text-bold text-brand">{item.numItems}</span>
                </span>
                <div className="toolbar__right">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => toggleItem(item, !itemVisible)}
                  >
                    <Icon />
                  </button>
                </div>
              </div>
              {itemVisible && item.renderItems(renderProps)}
            </li>
          );
        })}
      </ul>
    </React.Fragment>
  );
};
