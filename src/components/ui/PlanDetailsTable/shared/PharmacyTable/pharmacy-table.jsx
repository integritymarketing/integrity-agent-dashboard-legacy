import React, { useCallback, useMemo, useState } from "react";
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

const PharmacyTable = ({ contact, planData, isMobile, isEnroll, refresh }) => {
    const { pharmacies: pharmacyList, deletePharmacy, fetchPharmacies, putLeadPharmacy } = useHealth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const leadId = contact?.leadsId;

    const hasApiFailed = useMemo(
        () => pharmacyList?.length === 0 && planData?.pharmacyCosts?.length > 0,
        [pharmacyList, planData]
    );

    const pharmacyCostMap = useMemo(
        () => new Map(planData?.pharmacyCosts?.map((cost) => [cost.pharmacyID, cost.isNetwork])),
        [planData]
    );

    const handleSetAsPrimary = useCallback(
        async (pharmacyId) => {
            const pharmacyItem = { ...pharmacyList.find((item) => item.pharmacyId === pharmacyId), isPrimary: true };
            await putLeadPharmacy(leadId, pharmacyItem);
            refresh();
            setIsEditModalOpen(false);
        },
        [pharmacyList, putLeadPharmacy, leadId, refresh]
    );

    const onDeletePharmacy = useCallback(
        async (pharmacy) => {
            await deletePharmacy(pharmacy, null, leadId);
            if (pharmacy.isPrimary) {
                const pharmacyToMakePrimary = pharmacyList.find((item) => item.pharmacyId !== pharmacy.pharmacyId);

                if (pharmacyToMakePrimary) {
                    await handleSetAsPrimary(pharmacyToMakePrimary.pharmacyId);
                }

                const updatedPharmacies = await fetchPharmacies(leadId);
                if (!updatedPharmacies.length) {
                    window.location.reload(true);
                }
            }
        },
        [pharmacyList, deletePharmacy, fetchPharmacies, handleSetAsPrimary, leadId]
    );

    const renderDeleteButton = useCallback(
        (pharmacy) => (
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
        ),
        [onDeletePharmacy]
    );

    const columns = useMemo(() => {
        return [
            {
                id: "pharmacy-group",
                header: "Pharmacy",
                columns: isMobile
                    ? [
                          {
                              id: "mobileDetails-label",
                              header: "Details",
                              hideHeader: true,
                              cell: ({ row }) => row.original.name,
                          },
                      ]
                    : [
                          {
                              id: "name-label",
                              header: "Name",
                              cell: ({ row }) => row.original.name,
                          },
                          {
                              id: "address-value",
                              header: "Address",
                              cell: ({ row }) => row.original.address,
                          },
                      ],
            },
        ];
    }, []);

    const tableData = useMemo(() => {
        if (!pharmacyList || !Array.isArray(planData?.pharmacyCosts)) {
            return [];
        }

        return pharmacyList.map((pharmacy) => {
            const { pharmacyId, name, pharmacyPhone, isDigital, address1, address2, city, state, zip } = pharmacy;
            const address = formatAddress({ address1, address2, city, stateCode: state, postalCode: zip });
            const isCovered = pharmacyCostMap.get(pharmacyId) || false;

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
                            <div>{isDigital ? <div>{DIGITAL_PHARMACY}</div> : <div className={""}>{address}</div>}</div>
                        </div>
                    </div>
                ),
                address: (
                    <div className="address">
                        <span className="networkIcon">
                            {pharmacyCostMap.get(pharmacy?.pharmacyId) ? <InNetworkIcon /> : <OutNetworkIcon />}
                        </span>
                        {address}
                    </div>
                ),
                action: renderDeleteButton(),
            };
        });
    }, [pharmacyList, planData, hasApiFailed]);

    const handleEditClick = () => {
        setIsEditModalOpen(pharmacyList?.length > 0);
        setIsAddModalOpen(pharmacyList?.length === 0);
    };

    return (
        <>
            <PlanDetailsTableWithCollapse
                columns={columns}
                data={tableData}
                className="quotes"
                header="Pharmacy"
                tbodyClassName="pharmacy-body"
                actions={
                    !isEnroll && (
                        <Edit
                            label={pharmacyList?.length ? "Edit" : "Add"}
                            onClick={handleEditClick}
                            icon={pharmacyList?.length ? <EditIcon /> : <PlusIcon />}
                        />
                    )
                }
            />
            {isEditModalOpen && (
                <Modal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    hideFooter
                    title="Update Pharmacy"
                >
                    <UpdateView
                        pharmaciesData={pharmacyList}
                        handleSetAsPrimary={handleSetAsPrimary}
                        pharmacyCosts={planData?.pharmacyCosts}
                        onDelete={onDeletePharmacy}
                    />
                </Modal>
            )}
            {isAddModalOpen && (
                <PharmacyModal
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    leadId={leadId}
                    refresh={refresh}
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