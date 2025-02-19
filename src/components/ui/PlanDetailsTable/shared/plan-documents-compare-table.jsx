import React, { useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

export function PlanDocumentsCompareTable({ plans = [] }) {
    // Ensure all plans exist in a list of 3 for column mapping
    const clonedPlans = useMemo(() => {
        const copyPlans = [...plans];
        while (copyPlans.length < 3) {
            copyPlans.push(null);
        }
        return copyPlans;
    }, [plans]);

    // Collect all documents from the plans
    const allDocuments = useMemo(() => {
        return clonedPlans.flatMap((plan) => plan?.documents || []);
    }, [clonedPlans]);

    /**
     * Table Columns
     */
    const columns = useMemo(
        () => [
            {
                id: "plan-documents-group",
                header: "Plan Documents",
                columns: [
                    {
                        id: "name",
                        accessorKey: "name",
                        header: "Document Name",
                        cell: ({ row }) => <span className="label">{row.original.name || "-"}</span>,
                    },
                    ...clonedPlans.map((plan, index) => ({
                        id: `plan-${index}`,
                        accessorKey: `plan-${index}`,
                        header: `Plan ${index + 1}`,
                        cell: ({ row }) => {
                            const value = row.original[`plan-${index}`];
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

    /**
     * Collect unique documents across all plans
     */
    const uniqDocs = useMemo(() => {
        const docMap = {};
        allDocuments.forEach((doc) => {
            if (!docMap[doc.name]) {
                docMap[doc.name] = doc;
            }
        });
        return Object.values(docMap);
    }, [allDocuments]);

    /**
     * Table Data
     */
    const data = useMemo(
        () =>
            uniqDocs.map((document) => ({
                name: document.name,
                ...clonedPlans.reduce((acc, plan, index) => {
                    acc[`plan-${index}`] = plan?.documents?.find((pr) => pr.name === document.name) || null;
                    return acc;
                }, {}),
            })),
        [clonedPlans, uniqDocs]
    );

    return <PlanDetailsTableWithCollapse columns={columns} data={data} compareTable={true} header={"Plan Documents"} />;
}

export default PlanDocumentsCompareTable;
