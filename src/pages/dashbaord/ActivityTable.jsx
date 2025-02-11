import React, { useMemo } from "react";
import "./activitytable.scss";

function getProp(object, keys, defaultVal) {
  keys = Array.isArray(keys) ? keys : keys.split(".");
  object = object[keys[0]];
  if (object && keys.length > 1) {
    return getProp(object, keys.slice(1));
  }
  return object === undefined ? defaultVal : object;
}

const TRow = ({ row, headers, pageData }) => {
  return (
    <div className="trow">
      {headers.map(({ accessor, className, cell }, idx) => (
        <div key={idx} className={`tcell ${className || accessor}`}>
          {cell ? cell({ row }) : getProp(row, accessor, "")}
        </div>
      ))}
    </div>
  );
};

export default function ActivityTable({
  caption = "",
  headers = [],
  rows = [],
  totalRecords,
  onLoadMore,
}) {
  const handleLoadMore = () => {
    onLoadMore && onLoadMore();
  };
  const hasMore = useMemo(() => {
    return rows.length < totalRecords;
  }, [totalRecords, rows.length]);

  return (
    <div className="activity-table">
      <span className="title">{caption}</span>
      <div className="table">
        <div className="thead">
          <div className="trow">
            {headers.map(({ className, title }, idx) => (
              <div key={idx} className={`tcell ${className}`}>
                {title}
              </div>
            ))}
          </div>
        </div>
        <div className="tbody MenuList">
          {rows.map((row, idx) => (
            <TRow key={idx} headers={headers} row={row} />
          ))}
          {hasMore && (
            <div onClick={handleLoadMore} className="load-more">
              Load more activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
