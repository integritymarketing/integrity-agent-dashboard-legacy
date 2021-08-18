import React from "react";
import PropTypes from "prop-types";
import "./detailscard.scss";
import Plus from "components/icons/plus";
import { Button } from "components/ui/Button";
import WithLoader from "components/ui/WithLoader";
import DetailsTable from "../DetailsTable";

function DetailsCard({
  headerTitle,
  onAddClick,
  buttonLabel = "Add",
  items = [],
  Row,
  onDelete,
  onEdit,
  isLoading = false,
}) {
  const title = headerTitle.toLowerCase();
  let titleToAdd = title;
  if (titleToAdd === "Pharmacies") {
    titleToAdd = "pharmacy";
  } else {
    titleToAdd = titleToAdd.slice(0, -1);
  }
  const itemsLength = items?.length > 0 ? items.length : "";
  const displayTitleWithCount =
    itemsLength > 1
      ? `${headerTitle} (${itemsLength})`
      : headerTitle === "Pharmacies"
      ? `Pharmacy ${itemsLength && `(${itemsLength})`}`
      : `${headerTitle.slice(0, -1)} ${itemsLength && `(${itemsLength})`}`;

  return (
    <div className="details-card">
      <div className="header">
        {headerTitle && (
          <h4 className="headerTitle">{displayTitleWithCount}</h4>
        )}
        {onAddClick && (
          <div className="actions">
            <Button
              icon={<Plus />}
              iconPosition="left"
              label={buttonLabel}
              onClick={onAddClick}
              type="tertiary"
            />
          </div>
        )}
      </div>
      <div className="card-body">
        {items.length === 0 && (
          <WithLoader isLoading={isLoading}>
            <div className="no-items">
              <span>This contact has no {title},&nbsp;</span>
              <button className="link" onClick={onAddClick}>
                {" "}
                Add a {`${titleToAdd}`}
              </button>
            </div>
          </WithLoader>
        )}
        {items.length > 0 && (
          <DetailsTable
            items={items}
            Row={Row}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}
      </div>
    </div>
  );
}

DetailsCard.propTypes = {
  headerTitle: PropTypes.string.isRequired,
};

export default DetailsCard;
