import InNetworkCheck from "components/icons/in-network-check";
import OutNetworkX from "components/icons/out-network-x";
import React, { useMemo } from "react";
import PlanDetailsTable from "..";
import APIFail from "./APIFail/index";

function getInNetwork(pharmacyCost) {
  if (pharmacyCost.isNetwork) {
    if (pharmacyCost.isPreferred) {
      return (
        <>
          <InNetworkCheck />
          <span className={"in-network-label"}>In Network Preferred</span>
        </>
      );
    } else {
      return (
        <>
          <InNetworkCheck />
          <span className={"in-network-label"}>In Network</span>
        </>
      );
    }
  }
  return (
    <>
      <OutNetworkX />
      <span className={"in-network-label"}>Out of Network</span>
    </>
  );
}

export default ({ planData, pharmacies, isMobile }) => {
  const isApiFailed =
    planData?.pharmacyCosts?.filter((pharmacy) => pharmacy.pharmacyID)?.length >
    0
      ? false
      : true;
  const columns = useMemo(
    () => [
      {
        Header: "Pharmacies",
        columns: [
          ...(isMobile
            ? [
                {
                  hideHeader: true,
                  accessor: "name_address",
                },
              ]
            : [
                {
                  hideHeader: true,
                  accessor: "name",
                },
                {
                  hideHeader: true,
                  accessor: "address",
                },
              ]),
          {
            hideHeader: true,
            accessor: "inNetwork",
          },
        ],
      },
    ],
    [isMobile]
  );
  const data = [];

  if (planData.pharmacyCosts && Array.isArray(planData.pharmacyCosts)) {
    planData.pharmacyCosts.forEach((pharmacyCost) => {
      const pharmacy = pharmacies[pharmacyCost.pharmacyID];
      if (pharmacy) {
        const row = {
          name: <span className={"label"}>{pharmacy.name}</span>,
          address: (
            <span className={"subtext"}>
              {pharmacy.address1 +
                "\n" +
                pharmacy.address2 +
                "\n" +
                pharmacy.city +
                " " +
                pharmacy.state +
                " " +
                pharmacy.zip}
            </span>
          ),
          inNetwork: getInNetwork(pharmacyCost),
        };
        data.push({
          ...row,
          name_address: (
            <>
              <div>{row.name}</div>
              <div>{row.address}</div>
            </>
          ),
        });
      }
    });
  }
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
      <PlanDetailsTable
        columns={isApiFailed ? columnsData : columns}
        data={isApiFailed ? rowData : data}
        className="quotes"
      />
    </>
  );
};
