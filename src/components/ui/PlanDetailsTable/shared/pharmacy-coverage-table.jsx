import React, { useMemo } from "react";
import PropTypes from "prop-types";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const PharmacyCoverageTable = ({ planData }) => {
    const columns = useMemo(
        () => [
            {
                id: "pharmacy-coverage-group",
                header: "Pharmacy Coverage",
                columns: [
                    {
                        id: "label",
                        header: "Coverage Type",
                        cell: ({ row }) => <span className="label">{row.original.label}</span>,
                    },
                    {
                        id: "value",
                        header: "Amount",
                        cell: ({ row }) => row.original.value,
                    },
                ],
            },
        ],
        []
    );

    const data = useMemo(
        () => [
            {
                label: "Pharmacy Deductible",
                value: <span className="value">{currencyFormatter.format(planData?.drugDeductible ?? 0)}</span>,
            },
            {
                label: "Initial Coverage Limit",
                value: <span className="value">{currencyFormatter.format(planData?.initialCoverageLimit ?? 0)}</span>,
            },
        ],
        [planData]
    );

    return (
        <PlanDetailsTableWithCollapse columns={columns} data={data} header="Pharmacy Coverage" compareTable={true} />
    );
};

// PropTypes for type safety
PharmacyCoverageTable.propTypes = {
    planData: PropTypes.shape({
        drugDeductible: PropTypes.number,
        initialCoverageLimit: PropTypes.number,
    }).isRequired,
};

export default PharmacyCoverageTable;