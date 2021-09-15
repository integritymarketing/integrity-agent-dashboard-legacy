import React from "react";
import Media from "react-media";
import "./detailstable.scss";

function DetailsTable({ items, Row, onDelete, onEdit, headerTitle }) {
  const editButton = (item) =>
    onEdit ? (
      <div className="bottom-actions">
        <button
          className="edit"
          data-gtm={`buton-edit-${headerTitle}`}
          onClick={() => onEdit(item)}
        >
          Edit
        </button>
      </div>
    ) : null;
  const deleteButton = (item) =>
    onDelete ? (
      <div className="side-actions">
        <button
          className="delete"
          data-gtm={`buton-delete-${headerTitle}`}
          onClick={() => onDelete(item)}
        >
          Delete
        </button>
      </div>
    ) : null;

  return (
    <div className="details-table">
      {items.map((item, idx) => (
        <div className="row-group" key={idx}>
          {Row && <Row className="row" item={item} />}
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
