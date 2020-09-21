import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ExpandIcon from "components/icons/expand";
import CollapseIcon from "components/icons/collapse";

const identity = (x) => x;

export default ({ header, sections = [], ...props }) => {
  const { hash = "#" } = useLocation();
  const initialSection = hash.substr(1);

  const [expandedItems, setExpandedItems] = useState(
    [initialSection].filter(identity)
  );
  const isExpanded = sections.length === expandedItems.length;
  const renderProps = {
    isExpanded,
    toggleAll: () =>
      setExpandedItems(isExpanded ? [] : sections.map(({ id }) => id)),
  };

  const toggleItem = (item, show) => {
    if (show) {
      setExpandedItems([...expandedItems, item.id]);
    } else {
      setExpandedItems(expandedItems.filter((id) => id !== item.id));
    }
  };
  return (
    <React.Fragment>
      {header && header(renderProps)}
      <ul className="mt-2">
        {sections.map((item, idx) => {
          const itemVisible = expandedItems.includes(item.id);
          const Icon = itemVisible ? CollapseIcon : ExpandIcon;
          const collapsedClasses =
            idx === sections.length - 1
              ? ""
              : "mb-scale-2 pb-scale-2 border-bottom border-bottom--light";

          return (
            <li
              key={item.id}
              id={item.id}
              className={itemVisible ? null : collapsedClasses}
            >
              <div className="toolbar text-main">
                <span className="hdg hdg--4">
                  <span className="mr-1">{item.title}</span>{" "}
                  <span className="text-bold text-brand">{item.numItems}</span>
                </span>
                <div className="toolbar__aux">
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
