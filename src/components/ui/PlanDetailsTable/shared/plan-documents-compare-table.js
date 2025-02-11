import React, { useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

export function PlanDocumentsCompareTable({ plans }) {
    const clonedPlans = useMemo(() => {
        const copyPlans = [...plans];
        if (plans.length < 3) {
            copyPlans.push(null);
        }
        return copyPlans;
    }, [plans]);

    const allDocuments = clonedPlans.reduce((acc, plan) => {
        return [...acc, ...(plan?.documents || [])];
    }, []);

    const columns = useMemo(
        () => [
            {
                id: "plan-documents-group",
                header: "Plan Documents",
                columns: [
                    {
                        id: "name",
                        accessorKey: "name",
                        header: "",
                        hideHeader: true,
                    },
                    ...clonedPlans.map((plan, index) => ({
                        id: `plan-${index}`,
                        accessorKey: `plan-${index}`,
                        header: "",
                        hideHeader: true,
                        cell: ({ getValue }) => {
                            const value = getValue();
                            if (!plan) return "-";
                            return value ? (
                                <a href={value.url} target="_blank" rel="noopener noreferrer" className="comp-doc-link">
                                    {value.linkName}
                                </a>
                            ) : (
                                "-"
                            );
                        },
                    })),
                ],
            },
        ],
        [clonedPlans]
    );

    const uniqDocs = {};
    allDocuments.forEach((doc) => {
        if (!uniqDocs[doc.name]) {
            uniqDocs[doc.name] = doc;
        }
    });

    const data = Object.values(uniqDocs).map((document) => ({
        name: <span className="label">{document.name}</span>,
        [`plan-0`]: plans[0]?.documents.find((pr) => pr.name === document.name),
        [`plan-1`]: plans[1]?.documents.find((pr) => pr.name === document.name),
        [`plan-2`]: plans[2]?.documents.find((pr) => pr.name === document.name),
    }));

    return (
        <>
            <PlanDetailsTableWithCollapse columns={columns} data={data} compareTable={true} header={"Plan Documents"} />
        </>
    );
}