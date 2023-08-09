import React, { useMemo } from "react";
import APIFail from "./APIFail/index";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "../Icons/outNetwork";

function getInNetwork(pharmacyCost) {
  return pharmacyCost.isNetwork ? <InNetworkIcon /> : <OutNetworkIcon />;
}

const PharmacyTable = ({ planData, pharmacies, isMobile, pharmaciesList }) => {
  const isApiFailed =
    (pharmaciesList?.filter((pharmacy) => pharmacy.name)?.length > 0
      ? false
      : true) &&
    pharmaciesList !== null &&
    pharmaciesList?.length > 0;

  const columns = useMemo(
    () => [
      {
        Header: "Pharmacy",
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
            <>
              <div className={"address"}>
                <span className="networkIcon">
                  {getInNetwork(pharmacyCost)}
                </span>
                {pharmacy.address1 +
                  "\n" +
                  pharmacy.address2 +
                  "\n" +
                  pharmacy.city +
                  " " +
                  pharmacy.state +
                  " " +
                  pharmacy.zip}
              </div>
            </>
          ),
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
      Header: "Pharmacy",
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
        className="quotes"
        header="Pharmacy"
      />
    </>
  );
};

export default PharmacyTable;
