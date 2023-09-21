import React from "react";
import PropTypes from "prop-types";
import "./detailscard.scss";
import Plus from "components/icons/plus";
import { Button } from "components/ui/Button";
import WithLoader from "components/ui/WithLoader";
import DetailsTable from "../DetailsTable";
import ContactSectionCard from "packages/ContactSectionCard";

function DetailsCard({
  headerTitle,
  onAddClick,
  buttonLabel = "Add New",
  items = [],
  Row,
  onDelete,
  onEdit,
  isLoading = false,
  itemRender = () => null,
  provider,
  dataGtm,
}) {
  const title = headerTitle.toLowerCase();
  let titleToAdd = title;
  if (titleToAdd === "pharmacies") {
    titleToAdd = "pharmacy";
  } else {
    titleToAdd = titleToAdd.slice(0, -1);
  }
  const itemsLength = items?.length > 0 ? items.length : "";
  const displayTitleWithCount =
    itemsLength > 1
      ? `${headerTitle} (${itemsLength})`
      : headerTitle === "Pharmacies"
      ? `Pharmacy`
      : `${headerTitle.slice(0, -1)} ${
          itemsLength > 0 ? "(" + itemsLength + ")" : itemsLength
        }`;
  const disableStatus =
    headerTitle === "Pharmacies" && items.length > 0 ? true : false;

  return (
    <ContactSectionCard
      title={displayTitleWithCount}
      className={"enrollmentPlanContainer_detailsPage"}
      actions={
        onAddClick && (
          <div className="actions">
            <Button
              icon={<Plus disabled={disableStatus} />}
              disabled={disableStatus}
              iconPosition="left"
              label={buttonLabel}
              onClick={onAddClick}
              type="tertiary"
              style={{ whiteSpace: "nowrap" }}
            />
          </div>
        )
      }
    >
      <div className="card-body">
        <WithLoader isLoading={isLoading}>
          {items.length === 0 && (
            <div className="no-items">
              <span>This contact has no {title}.&nbsp;</span>
              <button
                className="link"
                data-gtm={`button-add-${title}`}
                onClick={onAddClick}
              >
                {" "}
                Add a {`${titleToAdd}`}
              </button>
            </div>
          )}
          {items.length > 0 && !provider && (
            <DetailsTable
              items={items}
              Row={Row}
              onDelete={onDelete}
              onEdit={onEdit}
              headerTitle={headerTitle}
            />
          )}
          {items.map(itemRender)}
        </WithLoader>
      </div>
    </ContactSectionCard>
  );
}

DetailsCard.propTypes = {
  headerTitle: PropTypes.string.isRequired,
};

export default DetailsCard;
