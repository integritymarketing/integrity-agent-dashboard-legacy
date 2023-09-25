import React, { useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";
import OutNetworkX from "../../../icons/out-network-x";
import InNetworkCheck from "../../../icons/in-network-check";
import APIFail from "./APIFail/index";

export function PharmaciesCompareTable({ plans, pharmacies }) {
  const clonedPlans = useMemo(() => {
    const copyPlans = [...plans];
    if (plans.length < 3) {
      copyPlans.push(null);
    }
    return copyPlans;
  }, [plans]);

  const isApiFailed =
    (pharmacies?.filter((pharmacy) => pharmacy?.name)?.length > 0
      ? false
      : true) &&
    pharmacies !== null &&
    pharmacies?.length > 0;

  const columns = useMemo(
    () => [
      {
        Header: "Pharmacies",
        columns: [
          {
            hideHeader: true,
            accessor: "name",
            Cell({ value }, original) {
              return (
                <div>
                  <span>{value}</span>
                  <div>{original.address}</div>
                </div>
              );
            },
          },
          ...clonedPlans.map((plan, index) => ({
            hideHeader: true,
            accessor: `plan-${index}`,
            Cell({ value }) {
              if (!plan) {
                return "-";
              }
              return value ? (
                <span className="pr-network">
                  <InNetworkCheck />{" "}
                  <span className="pr-network-text">In Network</span>
                </span>
              ) : (
                <span>
                  <OutNetworkX />
                  <span className="pr-network-text">Not In Network</span>
                </span>
              );
            },
          })),
        ],
      },
    ],
    [clonedPlans]
  );
  const data = pharmacies.map((document) => ({
    name: <span className="label">{document.name}</span>,
    address: document.address,
    [`plan-0`]: !!plans[0]?.pharmacyCosts?.find(
      (pr) => pr.pharmacyID === document.pharmacyID
    ),
    [`plan-1`]: !!plans[1]?.pharmacyCosts?.find(
      (pr) => pr.pharmacyID === document.pharmacyID
    ),
    [`plan-2`]: !!plans[2]?.pharmacyCosts?.find(
      (pr) => pr.pharmacyID === document.pharmacyID
    ),
  }));
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

  const rowData = [
    {
      unAvailable: <APIFail title={"Pharmacy"} />,
    },
  ];

  return (
    <>
      <PlanDetailsTableWithCollapse
        columns={isApiFailed ? columnsData : columns}
        data={isApiFailed ? rowData : data}
        compareTable={true}
        header={"Pharmacies"}
      />
    </>
  );
}