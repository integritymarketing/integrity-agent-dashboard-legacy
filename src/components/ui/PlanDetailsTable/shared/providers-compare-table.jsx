import React, { useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";
import OutNetworkX from "../../../icons/out-network-x";
import InNetworkCheck from "../../../icons/in-network-check";
import APIFail from "./APIFail/index";
import RenderProviders from "components/ui/ProvidersList";

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
    const allProviders = useMemo(() => Object.values(allProvidersById), [allProvidersById]);

    const isApiFailed =
        (allProviders?.filter((provider) => provider.firstName && provider.lastName)?.length > 0 ? false : true) &&
        allProviders !== null &&
        allProviders?.length > 0;

    const columns = useMemo(
        () => [
            {
                id: "providers-group",
                header: "Providers",
                columns: [
                    {
                        id: "provider",
                        accessorKey: "provider",
                        header: "",
                        hideHeader: true,
                        cell: ({ getValue }) => (
                            <div className="providerContainer">
                                <RenderProviders provider={getValue()} compareTable />
                            </div>
                        ),
                    },
                    ...clonedPlans.map((plan, index) => ({
                        id: `plan-${index}`,
                        accessorKey: `plan-${index}`,
                        header: "",
                        hideHeader: true,
                        cell: ({ getValue }) => {
                            const value = getValue();
                            if (!plan || !(plan.providers?.length > 0)) {
                                return "-";
                            }
                            return value ? (
                                <span className="pr-network">
                                    <InNetworkCheck /> <span className="pr-network-text">In Network</span>
                                </span>
                            ) : (
                                <span className="pr-network">
                                    <OutNetworkX /> <span className="pr-network-text">Not In Network</span>
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
        [`plan-0`]: !!plans[0]?.providers?.filter((pr) => pr.npi === provider.npi)[0]?.inNetwork,
        [`plan-1`]: !!plans[1]?.providers?.filter((pr) => pr.npi === provider.npi)[0]?.inNetwork,
        [`plan-2`]: !!plans[2]?.providers?.filter((pr) => pr.npi === provider.npi)[0]?.inNetwork,
    }));

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
                compareTable={true}
                header={"Providers"}
            />
        </>
    );
}