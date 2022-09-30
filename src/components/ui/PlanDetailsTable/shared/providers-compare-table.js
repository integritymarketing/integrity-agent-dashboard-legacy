import React, { useMemo } from "react";
import PlanDetailsTable from "..";
import OutNetworkX from "../../../icons/out-network-x";
import InNetworkCheck from "../../../icons/in-network-check";

export function ProvidersCompareTable({ plans }) {
  const clonedPlans = useMemo(() => {
    const copyPlans = [...plans];
    if (plans.length < 3) {
      copyPlans.push(null);
    }
    return copyPlans;
  }, [plans]);

  const allProvidersById = useMemo(
    () =>
      clonedPlans.reduce((acc, plan) => {
        const providers = plan ? plan.providers : [];
        (providers || []).forEach((provider) => {
          if (!acc[provider.npi]) {
            acc[provider.npi] = provider;
          }
        });
        return acc;
      }, {}),
    [clonedPlans]
  );
  const allProviders = useMemo(() => Object.values(allProvidersById), [
    allProvidersById,
  ]);

  const columns = useMemo(
    () => [
      {
        Header: "Providers",
        columns: [
          {
            hideHeader: true,
            accessor: "provider",
            Cell({ value: item }) {
              return (
                <div>
                  <div className="provider-content">
                    <div className="label">
                      <span>{item?.firstName}</span>{" "}
                      <span>{item?.lastName}</span>{" "}
                      {item?.title && (
                        <>
                          <span>/</span> <span>{item?.title}</span>
                        </>
                      )}
                      {/* {item?.firstName + item?.lastName + "/" + item?.title} */}
                    </div>
                    <div className="subtext">{item?.specialty}</div>
                  </div>
                  <div className="subtext pr-address">
                    <div className="pr-h2">
                      {`${
                        item?.address?.streetLine1
                          ? item?.address?.streetLine1 + ","
                          : ""
                      }`}
                      &nbsp;
                    </div>
                    <div className="pr-h2">
                      {`${
                        item?.address?.city ? item?.address?.city + "," : ""
                      }`}
                      &nbsp;
                      {`${
                        item?.address?.state ? item?.address?.state + "," : ""
                      }`}
                      &nbsp;
                      {`${
                        item?.address?.zipCode
                          ? item?.address?.zipCode + ","
                          : ""
                      }`}
                    </div>
                  </div>
                </div>
              );
            },
          },
          ...clonedPlans.map((plan, index) => ({
            hideHeader: true,
            accessor: `plan-${index}`,
            Cell({ value }) {
              if (!plan || !plan?.providers?.length > 0) {
                return "-";
              }
              return plan?.providers[0]?.inNetwork ? (
                <span className="pr-network">
                  <InNetworkCheck />{" "}
                  <span className="pr-network-text">In Network</span>
                </span>
              ) : (
                <span className="pr-network">
                  <OutNetworkX />{" "}
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

  const data = allProviders.map((provider, index) => ({
    provider,
    [`plan-${index}`]: !!plans[index]?.providers.find(
      (pr) => pr.npi === provider.npi
    ),
  }));

  return (
    <>
      <PlanDetailsTable columns={columns} data={data} compareTable={true} />
    </>
  );
}
