import React from "react";
import Media from "react-media";
import "./detailstable.scss";

function DetailsTable({ items, Row, onDelete, onEdit }) {
  const editButton = item => onEdit ? (
    <div className="bottom-actions">
      <button className="edit" onClick={() => onEdit(item)}>
        Edit
      </button>
    </div>
  ) : null;
  const deleteButton = item => onDelete ? (
    <div className="side-actions">
      <button className="delete" onClick={() => onDelete(item)}>
        Delete
      </button>
    </div>
  ) : null;

  return (
    <div className="details-table">
      {items.map((item, idx) => (
        <div className="row-group" key={idx}>
          { Row && <Row className="row" item={item} /> }
          <Media
            queries={{
              large: "(min-width: 768px)",
            }}
          >
            {(matches) =>
              matches.large ? (
                <>
                  {editButton(item)}
                  {deleteButton(item)}
                </>
              ) : (
                <>
                  {deleteButton(item)}
                  {editButton(item)}
                </>
              )
            }
          </Media>
        </div>
      ))}
    </div>
  );
}

export default DetailsTable;
