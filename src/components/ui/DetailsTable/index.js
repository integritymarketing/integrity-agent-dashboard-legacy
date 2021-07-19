import React from "react";
import "./detailstable.scss";

function DetailsTable({ items, Row, onDelete, onEdit }) {
  return (
    <div className="details-table">
      {items.map((item, idx) => (
        <div className="row-group">
          <Row className="row" item={item} key={idx} />
          {onDelete && (
            <div className="side-actions">
              <button className="delete" onClick={() => onDelete(item)}>
                Delete
              </button>
            </div>
          )}
          {onEdit && (
            <div className="bottom-actions">
              <button className="edit" onClick={() => onEdit(item)}>
               Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DetailsTable;
