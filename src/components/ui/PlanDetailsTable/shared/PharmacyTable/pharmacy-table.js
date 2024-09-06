import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useHealth } from "providers/ContactDetails/ContactDetailsContext";
import UpdateView from "./components/UpdateView/updateView";
import Edit from "components/Edit";
import Modal from "components/Modal";
import EditIcon from "components/icons/edit2";
import InNetworkIcon from "components/icons/inNetwork";
import PlusIcon from "components/icons/plus";

import PharmacyModal from "components/SharedModals/PharmacyModal";

import OutNetworkIcon from "../../Icons/outNetwork";
import PlanDetailsTableWithCollapse from "../../planDetailsTableWithCollapse";
import APIFail from "../APIFail/index";

const getNetworkIcon = (pharmacyCost) => {
    return pharmacyCost?.isNetwork ? <InNetworkIcon /> : <OutNetworkIcon />;
};

const PharmacyTable = ({ contact, planData, isMobile, isEnroll }) => {
    const { pharmacies: pharmacyList, deletePharmacy, fetchPharmacies } = useHealth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const leadId = contact?.leadsId;

    useEffect(() => {
        if (leadId) {
            fetchPharmacyDetails();
        }
    }, [leadId]);

    const fetchPharmacyDetails = useCallback(async () => {
        await fetchPharmacies(leadId);
    }, [leadId, fetchPharmacies]);

    const hasApiFailed =
        pharmacyList?.length === 0 && planData?.pharmacyCosts?.length > 0;

    const columns = useMemo(() => [
        {
            Header: "Pharmacy",
            columns: isMobile
                ? [
                    {
                        hideHeader: true,
                        accessor: "name_address"
                    },
                  ]
                : [
                      { hideHeader: true, accessor: "name" },
                    {
                        hideHeader: true,
                        accessor: "address"
                    },
                  ],
        },
    ], [isMobile]);

    const tableData = useMemo(() => {
        if (!pharmacyList || !Array.isArray(planData?.pharmacyCosts)) {return [];}
        
        return pharmacyList.map((pharmacy, index) => {
            const pharmacyCost = planData?.pharmacyCosts[index];
            return {
                name: <span className="label">{pharmacy?.name}</span>,
                address: (
                    <div className="address">
                        <span className="networkIcon">{getNetworkIcon(pharmacyCost)}</span>
                        {`${pharmacy?.address1}\n${pharmacy?.address2}\n${pharmacy?.city} ${pharmacy?.state} ${pharmacy?.zip}`}
                    </div>
                ),
                name_address: (
                    <>
                        <div>{pharmacy?.name}</div>
                        <div>{`${pharmacy?.address1}, ${pharmacy?.city}, ${pharmacy?.state} ${pharmacy?.zip}`}</div>
                    </>
                ),
            };
        });
    }, [pharmacyList, planData]);

    const handleEditClick = () => {
        if (pharmacyList?.length) {
            setIsEditModalOpen(true);
        } else {
            setIsAddModalOpen(true);
        }
    };

    return (
        <>
            <PlanDetailsTableWithCollapse
                columns={hasApiFailed ? [{ Header: "Pharmacy", columns: [{ accessor: "unAvailable" }] }] : columns}
                data={hasApiFailed ? [{ unAvailable: <APIFail title="Pharmacy" /> }] : tableData}
                className="quotes"
                header="Pharmacy"
                actions={
                    !isEnroll && (
                        <Edit
                            label={tableData.length ? "Edit" : "Add"}
                            onClick={handleEditClick}
                            icon={tableData.length ? <EditIcon /> : <PlusIcon />}
                        />
                    )
                }
            />
            {pharmacyList?.length > 0 && (
                <Modal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    hideFooter
                    title="Update Pharmacy"
                    isDelete
                    modalName="Pharmacy"
                    onDelete={() => {
                        deletePharmacy(pharmacyList?.[0], null, leadId);
                        setIsEditModalOpen(false);
                        setIsAddModalOpen(true);
                    }}
                >
                    <UpdateView data={pharmacyList[0]} />
                </Modal>
            )}
            {pharmacyList?.length === 0 && (
                <PharmacyModal
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    userZipCode={contact?.addresses?.[0]?.postalCode}
                    leadId={leadId}
                />
            )}
        </>
    );
};

PharmacyTable.propTypes = {
    contact: PropTypes.object,
    planData: PropTypes.object,
    isMobile: PropTypes.bool.isRequired,
    isEnroll: PropTypes.bool.isRequired,
};

export default PharmacyTable;
