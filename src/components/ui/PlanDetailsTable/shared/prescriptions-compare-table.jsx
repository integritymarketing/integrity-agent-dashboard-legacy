import React, { useMemo } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";
import APIFail from "./APIFail/index";
import Prescription, { currencyFormatter } from "./prescription";
import "./prescription.scss";
import { usePharmacyContext } from "providers/PharmacyProvider";

const EstimatedCost = ({ data, drugCount }) => {
    if (!data || !data?.cost) {
        return null;
    }

    return (
        <div className="prescription-container">
            <div className="row footer">
                <div className="col field">
                    <div className="title">Estimate Drug Cost</div>
                    <div className="sub-title">Based on {drugCount} drugs</div>
                </div>
                {data.cost.map((val, idx) => (
                    <div className="col val" key={idx}>
                        <div className="cost">{currencyFormatter.format(val)}</div>
                        <div className="duration">{data.startMonth} - Dec</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const renderCell = (value, rowIndex, totalRows, prescriptions) => {
    if (rowIndex === totalRows - 1) {
        return <EstimatedCost data={value} drugCount={prescriptions?.length} />;
    }
    return <Prescription data={value} prescriptions={prescriptions} />;
};

const getTableData = (plans = [], prescriptions = [], startMonth) => {
    const { selectedPharmacy } = usePharmacyContext();
    const rows = [];

    for (let i = 0, len = prescriptions.length; i < len; i++) {
        const planDrugCoverage = plans[0]?.planDrugCoverage?.[i];
        rows.push({
            data: {
                gap: [],
                copay: [],
                covered: [],
                retail: [],
                restrictions: [],
                catastrophic: [],
                drugName: planDrugCoverage?.labelName,
                type: planDrugCoverage?.tierDescription || "Non-Preferred Drug",
            },
        });

        plans.forEach(({ pharmacyCosts } = {}, planIndex) => {
            const currentDrugCoverage = plans[planIndex]?.planDrugCoverage?.[i];
            const rowData = rows[i]?.data;

            let pharmacy =
                selectedPharmacy?.pharmacyId && Object.keys(selectedPharmacy).length
                    ? pharmacyCosts?.find((rx) => rx?.pharmacyID === selectedPharmacy?.pharmacyId)
                    : pharmacyCosts?.find((rx) => rx?.pharmacyType === 2);

            const costs = pharmacy?.drugCosts?.find((pres) => pres.labelName === planDrugCoverage?.labelName) || {};

            rowData.gap[planIndex] = costs?.gap;
            rowData.copay[planIndex] = costs?.beforeGap;
            rowData.catastrophic[planIndex] = costs?.afterGap;
            rowData.retail[planIndex] = costs?.deductible;
            rowData.restrictions[planIndex] = {
                hasPriorAuthorization: currentDrugCoverage?.hasPriorAuthorization,
                hasQuantityLimit: currentDrugCoverage?.hasQuantityLimit,
                hasStepTherapy: currentDrugCoverage?.hasStepTherapy,
                quantityLimitAmount: currentDrugCoverage?.quantityLimitAmount,
                quantityLimitDays: currentDrugCoverage?.quantityLimitDays,
            };
            rowData.covered[planIndex] = currentDrugCoverage?.tierNumber > 0;
        });
    }

    rows.push({
        data: {
            startMonth,
            cost: plans.map((plan) => {
                let pharmacy =
                    selectedPharmacy?.pharmacyId && Object.keys(selectedPharmacy).length
                        ? plan?.estimatedCostCalculationRxs?.find(
                              (rx) => rx?.pharmacyId === selectedPharmacy?.pharmacyId
                          )
                        : plan?.estimatedCostCalculationRxs?.find((rx) => rx?.isMailOrder);

                return pharmacy?.estimatedYearlyRxDrugCost;
            }),
        },
    });

    return rows;
};

export function PrescriptionsCompareTable({ plans = [], prescriptions = [], apiError }) {
    const isEmptyData = prescriptions?.length === 0;
    const { effectiveDate } = useParams();
    const startMonth = moment.utc(effectiveDate).format("MMM");

    const columns = useMemo(() => {
        return [
            {
                id: "prescriptions-group",
                header: "Prescriptions",
                columns: [
                    {
                        id: "drugName",
                        header: "Drug Name",
                        cell: ({ row }) =>
                            renderCell(row.original.data, row.index, prescriptions.length + 1, prescriptions),
                    },
                ],
            },
        ];
    }, [prescriptions]);

    const data = useMemo(() => getTableData(plans, prescriptions, startMonth), [plans, prescriptions, startMonth]);

    const columnsData = [
        {
            id: "prescriptions-group",
            header: "Prescriptions",
            columns: [
                {
                    id: "unAvailable",
                    hideHeader: true,
                    cell: ({ row }) => row.original.unAvailable,
                },
            ],
        },
    ];

    const emptyColumnsData = [
        {
            id: "empty-prescriptions-group",
            header: "Prescriptions",
            columns: [
                {
                    id: "noData",
                    hideHeader: true,
                    accessorKey: "empty",
                },
            ],
        },
    ];

    const rowData = [{ unAvailable: <APIFail title={"Prescription"} /> }];
    const emptyRowData = [];

    return (
        <PlanDetailsTableWithCollapse
            columns={apiError ? columnsData : isEmptyData ? emptyColumnsData : columns}
            data={apiError ? rowData : isEmptyData ? emptyRowData : data}
            compareTable={true}
            header={"Prescriptions"}
        />
    );
}