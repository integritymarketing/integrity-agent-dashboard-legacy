import InNetworkCheck from "components/icons/in-network-check";
import OutNetworkX from "components/icons/out-network-x";
import { useParams } from "react-router-dom";
import { parseDate } from "utils/dates";
import React, { useMemo } from "react";
import APIFail from "./APIFail/index";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";
import { usePharmacyContext } from "providers/PharmacyProvider";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

function getCoveredCheck(isCovered) {
    if (isCovered) {
        return (
            <>
                <InNetworkCheck />
                <span className={"in-network-label"}>Covered</span>
            </>
        );
    }
    return (
        <>
            <OutNetworkX /> <span className={"in-network-label"}>Not Covered</span>
        </>
    );
}
const PrescriptionTable = ({ planData, isMobile }) => {
    const { effectiveDate } = useParams();
    const effectiveStartDate = parseDate(effectiveDate, "yyyy-MM-dd");
    const effectiveEndDate = new Date(effectiveStartDate);
    effectiveEndDate.setMonth(11);
    const monthsRemaining = effectiveEndDate.getMonth() - effectiveStartDate.getMonth();
    const effectiveDateString = `${effectiveStartDate.toLocaleString("default", {
        month: "long",
    })} ${effectiveStartDate.getFullYear()} `;

    const { selectedPharmacy } = usePharmacyContext();

    const isApiFailed =
        (planData?.planDrugCoverage?.filter((drug) => drug.labelName)?.length > 0 ? false : true) &&
        planData?.planDrugCoverage !== null &&
        planData?.planDrugCoverage?.length > 0;

    const columns = useMemo(
        () => [
            {
                id: "prescriptions-group",
                header: "Prescriptions",
                columns: [
                    ...(isMobile
                        ? [
                              {
                                  id: "name_cost",
                                  accessorKey: "name_cost",
                                  header: "",
                                  hideHeader: true,
                              },
                          ]
                        : [
                              {
                                  id: "name",
                                  accessorKey: "name",
                                  header: "",
                                  hideHeader: true,
                              },
                              {
                                  id: "cost",
                                  accessorKey: "cost",
                                  header: "",
                                  hideHeader: true,
                              },
                          ]),
                    {
                        id: "covered",
                        accessorKey: "covered",
                        header: "",
                        hideHeader: true,
                    },
                ],
            },
        ],
        [isMobile]
    );

    const pharmacyCost = selectedPharmacy.pharmacyId
        ? planData?.pharmacyCosts.find((rx) => rx?.pharmacyId == selectedPharmacy.pharmacyId)
        : planData?.pharmacyCosts.find((rx) => rx?.pharmacyType === 2 || rx?.isMailOrder);

    const prescriptionMap = {};
    if (planData.planDrugCoverage && Array.isArray(planData.planDrugCoverage)) {
        planData.planDrugCoverage.forEach((drugCoverage) => {
            prescriptionMap[drugCoverage.labelName] = {
                isCovered: drugCoverage.tierNumber !== 0,
                cost: 0,
            };
        });
    }

    const data = [];
    if (pharmacyCost.monthlyCosts && Array.isArray(pharmacyCost.monthlyCosts)) {
        for (let i = 0; i <= monthsRemaining; i++) {
            const monthlyCost = pharmacyCost.monthlyCosts[i];
            if (monthlyCost.costDetail && Array.isArray(monthlyCost.costDetail)) {
                for (let k = 0; k < monthlyCost.costDetail.length; k++) {
                    const costDetail = monthlyCost.costDetail[k];
                    prescriptionMap[costDetail.labelName].cost += costDetail.memberCost;
                }
            }
        }
    }
    Object.keys(prescriptionMap).forEach((labelName) => {
        const row = {
            name: <span className={"label"}>{labelName}</span>,
            cost: (
                <>
                    <span className={"label"}>
                        {currencyFormatter.format(prescriptionMap[labelName].cost)} <span className="per">/year</span>
                    </span>
                    <span className={"subtext"}>Estimate based on an effective date {effectiveDateString}</span>
                </>
            ),
            covered: getCoveredCheck(prescriptionMap[labelName].isCovered),
        };
        data.push({
            ...row,
            name_cost: (
                <>
                    <div>{row.name}</div>
                    <div>{row.cost}</div>
                </>
            ),
        });
    });

    const columnsData = [
        {
            Header: "Prescriptions",
            columns: [
                {
                    hideHeader: true,
                    accessor: "unAvailable",
                },
            ],
        },
    ];

    const rowData = [
        {
            unAvailable: <APIFail title={"Prescription"} />,
        },
    ];

    return (
        <>
            <PlanDetailsTableWithCollapse
                columns={isApiFailed ? columnsData : columns}
                data={isApiFailed ? rowData : data}
                className="quotes"
                header="Prescriptions"
            />
        </>
    );
};

export default PrescriptionTable;