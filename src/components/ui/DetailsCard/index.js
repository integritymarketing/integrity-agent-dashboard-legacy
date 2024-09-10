import PropTypes from "prop-types";
import "./detailscard.scss";
import Plus from "components/icons/plus";
import { Button as MuiButton } from "@mui/material";
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
    disabled = false,
}) {
    const isPharmacy = headerTitle.toLowerCase() === "pharmacies";
    const title = isPharmacy ? "Pharmacy" : headerTitle;
    const itemsLength = items.length;
    const displayTitle = (
        <span>
            {title}
            <span className="count"> {itemsLength > 0 ? `(${itemsLength})` : "(0)"} </span>
        </span>
    );

    return (
        <ContactSectionCard
            title={displayTitle}
            className="enrollmentPlanContainer_detailsPage"
            isDashboard
            contentClassName="enrollmentPlanContainer_detailsPage_content"
            actions={
                onAddClick && (
                    <div className="actions">
                        <MuiButton
                            sx={{ fontSize: "14px", fontWeight: "400" }}
                            disabled={disabled}
                            iconPosition="right"
                            label={buttonLabel}
                            onClick={onAddClick}
                            type="tertiary"
                            endIcon={<Plus disabled={disabled} />}
                        >
                            {buttonLabel}
                        </MuiButton>
                    </div>
                )
            }
        >
            <div className="card-body">
                <WithLoader isLoading={isLoading}>
                    {itemsLength === 0 && (
                        <div className="no-items">
                            <span>This contact has no {title.toLowerCase()}.</span>
                            <button
                                className="link"
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
    items: PropTypes.arrayOf(PropTypes.object),
    Row: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    isLoading: PropTypes.bool,
    itemRender: PropTypes.func,
    provider: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default DetailsCard;
