import InNetworkCheck from "components/icons/in-network-check";
import OutNetworkX from "components/icons/out-network-x";
import UnknownNetworkCheck from "components/icons/unknown-network-check";
import React, { useMemo } from "react";
import APIFail from "./APIFail/index";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

function getInNetwork(isCovered, isPlanNetworkAvailable) {
  if (isPlanNetworkAvailable === false) {
    return (
      <>
        <UnknownNetworkCheck />
        <span className={"in-network-label"}>Unknown Network</span>
      </>
    );
  }
  if (isCovered) {
    return (
      <>
        <InNetworkCheck />
        <span className={"in-network-label"}>In Network</span>
      </>
    );
  }
  return (
    <>
      <OutNetworkX />
      <span className={"in-network-label"}>Out of Network</span>
    </>
  );
}

const ProviderTable =  ({ planData, isMobile }) => {
  const isApiFailed =
    (planData?.providers?.filter(
      (provider) => provider.firstName && provider.lastName
    )?.length > 0
      ? false
      : true) &&
    planData?.providers !== null &&
    planData?.providers?.length > 0;

  const columns = useMemo(
    () => [
      {
        Header: "Providers",
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

  if (planData.providers && Array.isArray(planData.providers)) {
    for (var i = 0; i < planData.providers.length; i++) {
      var provider = planData.providers[i];
      if (provider?.firstName && provider?.lastName) {
        const row = {
          name: (
            <>
              <span className={"label"}>
                {`${provider.title || ""} ${provider.firstName} ${
                  provider.lastName
                } ${provider.suffix || ""}`}
              </span>
              <span className={"subtext"}>{provider.specialty}</span>
            </>
          ),
          address: (
            <span className={"subtext"}>
              {`${provider?.address?.streetLine1 || ""} ${
                provider?.address?.streetLine2 || ""
              }
            ${provider?.address?.city || ""} ${provider?.address?.state || ""}
            ${provider?.address?.zipCode || ""}`}
            </span>
          ),
          inNetwork: getInNetwork(
            provider.inNetwork,
            planData.isPlanNetworkAvailable
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
      } else {
      }
    }
  }

  const columnsData = [
    {
      Header: "Providers",
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
      unAvailable: <APIFail title={"Provider"} />,
    },
  ];
  return (
    <>
      <PlanDetailsTableWithCollapse
        columns={isApiFailed ? columnsData : columns}
        data={isApiFailed ? rowData : data}
        className="quotes"
        header="Providers"
      />
    </>
  );
};

export default ProviderTable;
