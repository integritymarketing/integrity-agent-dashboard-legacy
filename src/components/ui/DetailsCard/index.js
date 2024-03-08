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
  const isPharmacy = headerTitle.toLowerCase() === 'pharmacies';
  const title = isPharmacy ? 'Pharmacy' : headerTitle;
  const itemsLength = items.length;
  const displayTitle = (
    <span>
      {title}
      <span className="count"> {itemsLength > 0 ? `(${itemsLength})` : '(0)'} </span>
    </span>
  );

  return (
    <ContactSectionCard
      title={displayTitle}
      className='enrollmentPlanContainer_detailsPage'
      isDashboard
      contentClassName='enrollmentPlanContainer_detailsPage_content'
      actions={
        onAddClick && (
          <div className='actions'>
            <Button
              icon={<Plus />}
              disabled={isPharmacy && itemsLength > 0}
              iconPosition='right'
              label={buttonLabel}
              onClick={onAddClick}
              type='tertiary'
              className='buttonWithIcon'
            />
          </div>
        )
      }
    >
      <div className='card-body'>
        <WithLoader isLoading={isLoading}>
          {itemsLength === 0 && (
            <div className='no-items'>
              <span>This contact has no {title.toLowerCase()}.</span>
              <button
                className='link'
                data-gtm={`button-add-${title.toLowerCase()}`}
                onClick={onAddClick}
              >
                Add {title}
              </button>
            </div>
          )}
          {itemsLength > 0 && !provider && (
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
  onAddClick: PropTypes.func,
  buttonLabel: PropTypes.string,
  items: PropTypes.array,
  Row: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  isLoading: PropTypes.bool,
  itemRender: PropTypes.func,
  provider: PropTypes.bool,
  dataGtm: PropTypes.string,
};

export default DetailsCard;
