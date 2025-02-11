import React, { forwardRef, useMemo } from "react";
import PropTypes from "prop-types";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export const labelMap = {
    1: "Preferred Generic",
    2: "Generic",
    3: "Preferred Brand",
    4: "Non-Preferred Drug",
    5: "Specialty Tier",
};

const FormularyTiersTable = forwardRef(({ planData, isPreferred, isRetail, header, className }, ref) => {
    const columns = useMemo(
        () => [
            {
                id: "group-header",
                header,
                columns: [
                    {
                        id: "label",
                        header: "Tier",
                        cell: ({ row }) => <span className="label">{row.original.label}</span>,
                    },
                    {
                        id: "value",
                        header: "Cost Details",
                        cell: ({ row }) =>
                            row.original.value.length > 0 ? row.original.value : <span className="no-data">N/A</span>,
                    },
                ],
            },
        ],
        [header]
    );

    const data = useMemo(() => {
        const tiers = planData?.formularyTiers ?? [];

        return tiers.reduce((acc, tier) => {
            if (!Array.isArray(tier?.copayPrices)) return acc;

            const values = tier.copayPrices
                .filter((copay) => copay.isPreferredPharmacy === isPreferred && copay.isMailOrder === !isRetail)
                .map((copay, index) => (
                    <div key={`${tier.tierNumber}-${index}`} className="copay">
                        <div className="label">
                            {copay.costType === 1
                                ? currencyFormatter.format(copay.cost)
                                : `${Math.round(copay.cost * 100)}%`}
                        </div>
                        <div className="supply">
                            {copay.costType === 1 ? "copay" : "coinsurance"} ({copay.daysOfSupply}-day supply)
                        </div>
                    </div>
                ));

            acc.push({
                label: labelMap[tier?.tierNumber] || `Unknown Tier`,
                value: values.length > 0 ? values : [],
            });

            return acc;
        }, []);
    }, [planData, isPreferred, isRetail]);

    return (
        <div className={className} ref={ref}>
            <PlanDetailsTableWithCollapse columns={columns} data={data} header={header} compareTable={true} />
        </div>
    );
});

// PropTypes for Type Safety
FormularyTiersTable.propTypes = {
    planData: PropTypes.shape({
        formularyTiers: PropTypes.arrayOf(
            PropTypes.shape({
                tierNumber: PropTypes.number,
                copayPrices: PropTypes.arrayOf(
                    PropTypes.shape({
                        isPreferredPharmacy: PropTypes.bool,
                        isMailOrder: PropTypes.bool,
                        costType: PropTypes.number,
                        cost: PropTypes.number,
                        daysOfSupply: PropTypes.number,
                    })
                ),
            })
        ),
    }),
    isPreferred: PropTypes.bool,
    isRetail: PropTypes.bool,
    header: PropTypes.string.isRequired,
    className: PropTypes.string,
};

// Default props
FormularyTiersTable.defaultProps = {
    planData: {},
    isPreferred: false,
    isRetail: false,
    className: "",
};

export default FormularyTiersTable;