import InNetworkCheck from "components/icons/in-network-check";
import OutNetworkX from "components/icons/out-network-x";
import UnknownNetworkCheck from "components/icons/unknown-network-check";
import React, { useMemo } from "react";
import PlanDetailsTable from "..";

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

export default ({ planData, isMobile }) => {
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
            {provider.address.streetLine1 +
              "\n" +
              provider.address.streetLine2 +
              "\n" +
              provider.address.city +
              " " +
              provider.address.state +
              " " +
              provider.address.zipCode}
          </span>
        ),
        inNetwork: getInNetwork(
          provider.inNetwork,
          planData.isPlanNetworkAvailable
        ),
      }
      data.push({
        ...row,
        name_address: <><div>{row.name}</div><div>{row.address}</div></>
      });
    }
  }

  return (
    <>
      <PlanDetailsTable columns={columns} data={data} />
    </>
  );
};
