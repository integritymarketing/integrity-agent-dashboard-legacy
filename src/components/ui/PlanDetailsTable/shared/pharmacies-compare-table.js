import { useMemo } from "react";
import PropTypes from "prop-types";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";
import OutNetworkX from "../../../icons/out-network-x";
import InNetworkCheck from "../../../icons/in-network-check";
// Will be using the below imports in the future
// import InNetworkIcon from "components/icons/inNetwork";
// import OutNetworkIcon from "components/icons/outNetwork";
import APIFail from "./APIFail/index";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "components/icons/info";
import { formatAddress } from "utils/addressFormatter";

export function PharmaciesCompareTable({ plans, pharmacies, apiError }) {
    const clonedPlans = useMemo(() => {
        const copyPlans = [...plans];
        if (plans.length < 3) {
            copyPlans.push(null);
        }
        return copyPlans;
    }, [plans]);

    const isEmpty = !pharmacies || pharmacies.filter((pharmacy) => pharmacy?.name)?.length === 0;

    const columns = useMemo(
        () => [
            {
                Header: "Pharmacies",
                columns: [
                    {
                        hideHeader: true,
                        accessor: "name",
                        Cell({ value }) {
                            return (
                                <div>
                                    <span>{value}</span>
                                </div>
                            );
                        },
                    },
                    ...clonedPlans.map((plan, index) => ({
                        hideHeader: true,
                        accessor: `plan-${index}`,
                        Cell({ value }) {
                            if (!plan || !value) {
                                return "-";
                            }

                           const NetworkIcon = value.isNetwork ? InNetworkCheck : OutNetworkX;
                            return (
                                <span className="pr-network-inOut">
                                    <NetworkIcon />
                                    <span className="pr-network-pharmacy">{value.address}</span>
                                </span>
                            );
                        },
                    })),
                ],
            },
        ],
        [clonedPlans],
    );

    const data = useMemo(() => {
        if (!pharmacies) {
            return [];
        }

        return pharmacies.map((pharmacy) => {
            const pharmacyFormattedAddress = formatAddress({
                address1: pharmacy.address1,
                address2: pharmacy.address2,
                city: pharmacy.city,
                stateCode: pharmacy.state,
                postalCode: pharmacy.zip,
                defaultValue: "",
            });

            return {
                name: <span className="label">{pharmacy.name}</span>,
                address: pharmacyFormattedAddress,
                ...plans.reduce((acc, plan, index) => {
                    const pharmacyCost = plan?.pharmacyCosts?.find((pr) => {
                        return pr.pharmacyID === pharmacy.pharmacyId;
                    });

                    acc[`plan-${index}`] = pharmacyCost
                        ? {
                              isNetwork: pharmacyCost.isNetwork,
                              address: pharmacyFormattedAddress,
                          }
                        : null;
                    return acc;
                }, {}),
            };
        });
    }, [pharmacies, plans]);

    const notApplicableText = useMemo(() => <span className="naText">N/A</span>, []);

    const currencyFormatter = useMemo(
        () =>
            new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
        [],
    );

    const mailOrderRow = useMemo(
        () => ({
            name: (
                <span className="label">
                    Mail Order
                    <Tooltip
                        title="No address is shown as a mail order pharmacy is a licensed pharmacy that delivers prescription drugs by mail."
                        arrow
                    >
                        <span style={{ marginLeft: "4px" }}>
                            <InfoIcon />
                        </span>
                    </Tooltip>
                </span>
            ),
            ...plans.reduce((acc, plan, index) => {
                const cost = plan?.estimatedAnnualMailOrderDrugCostPartialYear;
                acc[`plan-${index}`] = plan?.hasMailDrugBenefits
                    ? cost != null
                        ? currencyFormatter.format(Number(cost).toFixed(2))
                        : notApplicableText
                    : notApplicableText;
                return acc;
            }, {}),
        }),
        [plans, currencyFormatter, notApplicableText],
    );

    const columnsData = [
        {
            Header: "Pharmacies",
            columns: [
                {
                    hideHeader: true,
                    accessor: "unAvailable",
                },
            ],
        },
    ];

    const emptyColumnsData = useMemo(
        () => [
            {
                Header: "Pharmacies",
                columns: [
                    {
                        hideHeader: true,
                        accessor: "name",
                    },
                    ...clonedPlans.map((plan, index) => ({
                        hideHeader: true,
                        accessor: `plan-${index}`,
                        Cell({ value }) {
                            if (!plan) {
                                return "-";
                            }
                            return plan.hasMailDrugBenefits
                                ? isEmpty
                                    ? notApplicableText
                                    : plan.estimatedAnnualMailOrderDrugCostPartialYear != null
                                      ? currencyFormatter.format(
                                            Number(plan.estimatedAnnualMailOrderDrugCostPartialYear).toFixed(2),
                                        )
                                      : notApplicableText
                                : notApplicableText;
                        },
                    })),
                ],
            },
        ],
        [clonedPlans, currencyFormatter, isEmpty, notApplicableText],
    );

    const rowData = [
        {
            unAvailable: <APIFail title={"Pharmacy"} />,
        },
    ];

    const emptyRowData = [mailOrderRow];

    return (
        <PlanDetailsTableWithCollapse
            columns={apiError ? columnsData : isEmpty ? emptyColumnsData : columns}
            data={apiError ? rowData : isEmpty ? emptyRowData : data}
            compareTable={true}
            header={"Pharmacies"}
        />
    );
}

PharmaciesCompareTable.propTypes = {
    plans: PropTypes.arrayOf(
        PropTypes.shape({
            pharmacyCosts: PropTypes.arrayOf(
                PropTypes.shape({
                    pharmacyId: PropTypes.string.isRequired,
                    isNetwork: PropTypes.bool.isRequired,
                }),
            ),
            hasMailDrugBenefits: PropTypes.bool,
            estimatedAnnualMailOrderDrugCostPartialYear: PropTypes.number,
        }),
    ).isRequired,
    pharmacies: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            address1: PropTypes.string,
            address2: PropTypes.string,
            city: PropTypes.string,
            state: PropTypes.string,
            zip: PropTypes.string,
        }),
    ),
    apiError: PropTypes.bool,
};

export default PharmaciesCompareTable;
