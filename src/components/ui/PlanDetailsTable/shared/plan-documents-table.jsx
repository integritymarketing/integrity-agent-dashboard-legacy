import React, { useMemo } from "react";
import PropTypes from "prop-types";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

const PlanDocumentsTable = ({ planData }) => {
    const columns = useMemo(
        () => [
            {
                id: "plan-documents-group",
                header: "Plan Documents",
                columns: [
                    {
                        id: "label",
                        header: "Document Name",
                        cell: ({ row }) => <span className="label">{row.original.label}</span>,
                    },
                    {
                        id: "value",
                        header: "Download Link",
                        cell: ({ row }) => row.original.value,
                    },
                ],
            },
        ],
        []
    );

    // Ensure that planData.documents is properly checked before mapping
    const data = useMemo(() => {
        if (!Array.isArray(planData?.documents)) return [];

        return planData.documents.map((document) => ({
            label: document.name,
            value: (
                <a className="link" href={document.url} target="_blank" rel="noopener noreferrer">
                    {document.linkName}
                </a>
            ),
        }));
    }, [planData]);

    return <PlanDetailsTableWithCollapse columns={columns} data={data} header="Plan Documents" compareTable={true} />;
};

// PropTypes validation
PlanDocumentsTable.propTypes = {
    planData: PropTypes.shape({
        documents: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                url: PropTypes.string.isRequired,
                linkName: PropTypes.string.isRequired,
            })
        ),
    }).isRequired,
};

export default PlanDocumentsTable;