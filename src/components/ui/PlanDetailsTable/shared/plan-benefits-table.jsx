import React, { useMemo } from "react";
import PropTypes from "prop-types";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const PlanBenefitsTable = ({ planData }) => {
    const columns = useMemo(
        () => [
            {
                id: "plan-benefits-group",
                header: "Plan Benefits",
                columns: [
                    {
                        id: "label",
                        header: "Benefit",
                        cell: ({ row }) => <span className="label">{row.original.label}</span>,
                    },
                    {
                        id: "value",
                        header: "Details",
                        cell: ({ row }) => row.original.value,
                    },
                ],
            },
        ],
        []
    );

    const data = useMemo(() => {
        const benefits = [
            {
                label: "Medical Deductible",
                value: <span className="value">{currencyFormatter.format(planData?.medicalDeductible ?? 0)}</span>,
            },
            {
                label: "In-Network Maximum Out-of-Pocket",
                value: <span className="value">{currencyFormatter.format(planData?.maximumOutOfPocketCost ?? 0)}</span>,
            },
        ];

        if (Array.isArray(planData?.planDataFields)) {
            planData.planDataFields.forEach((dataField) => {
                benefits.push({
                    label: dataField.name,
                    value: dataField.description ? (
                        <div className="description" dangerouslySetInnerHTML={{ __html: dataField.description }} />
                    ) : (
                        <span className="no-data">N/A</span>
                    ),
                });
            });
        }

        return benefits;
    }, [planData]);

    return (
        <PlanDetailsTableWithCollapse
            columns={columns}
            data={data}
            className="plan-benefits"
            header="Plan Benefits"
            compareTable={true}
        />
    );
};

// PropTypes for Type Safety
PlanBenefitsTable.propTypes = {
    planData: PropTypes.shape({
        medicalDeductible: PropTypes.number,
        maximumOutOfPocketCost: PropTypes.number,
        planDataFields: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                description: PropTypes.string,
            })
        ),
    }),
};

export default PlanBenefitsTable;