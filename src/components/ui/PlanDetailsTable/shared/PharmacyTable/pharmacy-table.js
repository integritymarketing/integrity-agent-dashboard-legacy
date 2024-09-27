import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { useHealth } from "providers/ContactDetails/ContactDetailsContext";
import UpdateView from "./components/UpdateView/updateView";
import Edit from "components/Edit";
import Modal from "components/Modal";
import DeleteIcon from "components/icons/version-2/Delete";
import EditIcon from "components/icons/edit2";
import InNetworkIcon from "components/icons/inNetwork";
import PlusIcon from "components/icons/plus";

import PharmacyModal from "components/SharedModals/PharmacyModal";

import OutNetworkIcon from "../../Icons/outNetwork";
import PlanDetailsTableWithCollapse from "../../planDetailsTableWithCollapse";
import { formatPhoneNumber } from "utils/phones";
import { formatAddress } from "utils/addressFormatter";
import { DIGITAL_PHARMACY } from "./components/UpdateView/updateView.constants";

const PharmacyTable = ({ contact, planData, isMobile, isEnroll }) => {
    const { pharmacies: pharmacyList, deletePharmacy, fetchPharmacies, putLeadPharmacy } = useHealth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const leadId = contact?.leadsId;

    const hasApiFailed = pharmacyList?.length === 0 && planData?.pharmacyCosts?.length > 0;

    const pharmacyCostMap = useMemo(
        () => new Map(planData?.pharmacyCosts?.map((cost) => [cost.pharmacyID, cost.isNetwork])),
        [planData?.pharmacyCosts],
    );

    const handleSetAsPrimary = async (pharmacyId) => {
        const pharmacyItem = { ...pharmacyList.find((item) => item.pharmacyId === pharmacyId), isPrimary: true };
        await putLeadPharmacy(leadId, pharmacyItem);
        fetchPharmacies(leadId);
    };
    const onDeletePharmacy = async (pharmacy) => {
        await deletePharmacy(pharmacy, null, leadId);
        if (pharmacy.isPrimary) {
            const pharmacyToMakePrimary = pharmacyList.find((item) => {
                if (item.pharmacyId !== pharmacy.pharmacyId) {
                    return true;
                }
            });
            if (pharmacyToMakePrimary) {
                await handleSetAsPrimary(pharmacyToMakePrimary.pharmacyId);
                window.location.reload(true);
            } else {
                const updatedPharmacies = await fetchPharmacies(leadId);
                if (!updatedPharmacies.length) window.location.reload(true);
            }
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: "Pharmacy",
                columns: isMobile
                    ? [
                        {
                            hideHeader: true,
                            accessor: "mobileDetails",
                        }
                    ]
                    : [
                        { hideHeader: true, accessor: "name" },
                        {
                            hideHeader: true,
                            accessor: "address",
                        },
                        {
                            hideHeader: true,
                            accessor: "action",
                        },
                    ],
            },
        ],
        [isMobile],
    );

    const tableData = useMemo(() => {
        if (!pharmacyList || !Array.isArray(planData?.pharmacyCosts)) {
            return [];
        }

        return pharmacyList.map((pharmacy) => {
            const { pharmacyId, name, pharmacyPhone, isDigital, address1, address2, city, state, zip } = pharmacy;
            const address = formatAddress({ address1, address2, city, stateCode: state, postalCode: zip });
            const isCovered = pharmacyCostMap.get(pharmacyId) || false;
            const renderDeleteButton = () => (
                <Button
                    variant="text"
                    className="deleteButton"
                    onClick={() => {
                        onDeletePharmacy(pharmacy);
                        setIsEditModalOpen(false);
                        setIsAddModalOpen(false);
                    }}
                    size="small"
                    endIcon={<DeleteIcon />}
                >
                    <div>{"Delete"}</div>
                </Button>
            )
            return {
                name: (
                    <div>
                        <span className="label">{name}</span>
                        <span className="phoneNumber">{formatPhoneNumber(pharmacyPhone)}</span>
                    </div>
                ),
                mobileDetails: (
                    <div className="container">
                        <div className="mobileLabel">{name}</div>
                        <div className="mobilePhoneNumber">
                            {formatPhoneNumber(pharmacyPhone)}
                            {renderDeleteButton()}
                        </div>
                        <div className="digitalContainer">
                            {isCovered ? <InNetworkIcon /> : <OutNetworkIcon />}
                            <div>
                                {isDigital ? (
                                    <div>{DIGITAL_PHARMACY}</div>
                                ) : (
                                    <div className={""}>{address}</div>
                                )}
                            </div>
                        </div>
                    </div>
                ),
                address: (
                    <div className="address">
                        <span className="networkIcon">{
                            pharmacyCostMap.get(pharmacy?.pharmacyId) ? <InNetworkIcon /> : <OutNetworkIcon />}</span>
                        {address}
                    </div>
                ),
                action: (
                    renderDeleteButton()
                )
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

    const refreshPage = () => {
        window.location.reload(true);
    }

    const noPharmacy = () => {
        return (
            <div className="no-items">
                <span className="noPharmacy">This contact has no pharmacy.</span>
                <span className="addButton" onClick={() => setIsAddModalOpen(true)}>
                    Add Pharmacy
                </span>
            </div>
        );
    };
    return (
        <>
            <PlanDetailsTableWithCollapse
                columns={hasApiFailed ? [{ Header: "Pharmacy", columns: [{ accessor: "unAvailable" }] }] : columns}
                data={hasApiFailed ? [{ unAvailable: noPharmacy() }] : tableData}
                className="quotes"
                header="Pharmacy"
                tbodyClassName="pharmacy-body"
                actions={
                    !isEnroll && (
                        <Edit
                            label={tableData.length ? "Edit" : "Add New"}
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
                    modalName="Pharmacy"
                    isAddPharmacy={pharmacyList.length < 3}
                    onAdd={() => setIsAddModalOpen(true)}
                >
                    <UpdateView
                        pharmaciesData={pharmacyList}
                        handleSetAsPrimary={handleSetAsPrimary}
                        pharmacyCosts={planData?.pharmacyCosts}
                        onDelete={(pharmacy) => {
                            onDeletePharmacy(pharmacy);
                            setIsEditModalOpen(false);
                            setIsAddModalOpen(false);
                        }}
                    />
                </Modal>
            )}
            {isAddModalOpen && (
                <PharmacyModal
                    open={isAddModalOpen}
                    pharmaciesPreSelected={pharmacyList}
                    onClose={refreshPage}
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