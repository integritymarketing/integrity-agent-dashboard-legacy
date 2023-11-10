import React, { useMemo, useState } from "react";
import { useLeadInformation } from "hooks/useLeadInformation";
import APIFail from "../APIFail/index";
import PlanDetailsTableWithCollapse from "../../planDetailsTableWithCollapse";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "../../Icons/outNetwork";
import Edit from "components/Edit";
import Modal from "components/Modal";
import UpdateView from "./components/UpdateView/updateView";
import AddPharmacy from "pages/contacts/contactRecordInfo/modals/AddPharmacy";
import EditIcon from "components/icons/edit2";
import PlusIcon from "components/icons/plus";

function getInNetwork(pharmacyCost) {
    return pharmacyCost.isNetwork ? <InNetworkIcon /> : <OutNetworkIcon />;
}

const PharmacyTable = ({ contact, planData, isMobile, isEnroll }) => {
    const { pharmacies: pharmaciesList, deletePharmacy } = useLeadInformation();
    const [open, setOpen] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);

    const isApiFailed =
        (pharmaciesList?.filter((pharmacy) => pharmacy.name)?.length > 0 ? false : true) &&
        pharmaciesList !== null &&
        pharmaciesList?.length > 0;

    const columns = useMemo(
        () => [
            {
                Header: "Pharmacy",
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
                ],
            },
        ],
        [isMobile]
    );
    const data = [];

    if (pharmaciesList && planData?.pharmacyCosts && Array.isArray(planData?.pharmacyCosts)) {
        pharmaciesList?.forEach((_, index) => {
            const pharmacy = pharmaciesList[0];
            const matchedPharmacyCost = planData?.pharmacyCosts[index];

            if (pharmacy) {
                const row = {
                    name: <span className={"label"}>{pharmacy?.name}</span>,
                    address: (
                        <>
                            <div className={"address"}>
                                <span className="networkIcon">{getInNetwork(matchedPharmacyCost)}</span>
                                {pharmacy?.address1 +
                                    "\n" +
                                    pharmacy?.address2 +
                                    "\n" +
                                    pharmacy?.city +
                                    " " +
                                    pharmacy?.state +
                                    " " +
                                    pharmacy?.zip}
                            </div>
                        </>
                    ),
                };
                data.push({
                    ...row,
                    name_address: (
                        <>
                            <div>{row?.name}</div>
                            <div>{row?.address}</div>
                        </>
                    ),
                });
            }
        });
    }
    const columnsData = [
        {
            Header: "Pharmacy",
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
            unAvailable: <APIFail title={"Pharmacy"} />,
        },
    ];

    const isEdit = pharmaciesList?.length > 0;

    return (
        <>
            <PlanDetailsTableWithCollapse
                columns={isApiFailed ? columnsData : columns}
                data={isApiFailed ? rowData : data}
                className="quotes"
                header="Pharmacy"
                actions={
                    !isEnroll ? (
                        <Edit
                            label={data.length ? "Edit" : "Add"}
                            onClick={() => {
                                if (isEdit) {
                                    setOpen(true);
                                } else {
                                    setOpenAddModal(true);
                                }
                            }}
                            icon={data.length ? <EditIcon /> : <PlusIcon />}
                        />
                    ) : null
                }
            />
            {isEdit && (
                <Modal
                    open={open}
                    onClose={() => {
                        setOpen(!open);
                    }}
                    hideFooter
                    title={"Update Pharmacy"}
                    isDelete={isEdit}
                    modalName={"Pharmacy"}
                    onDelete={() => {
                        deletePharmacy(pharmaciesList?.[0]);
                        setOpen(!open);
                        setOpenAddModal(true);
                    }}
                >
                    <UpdateView data={pharmaciesList?.[0]} />
                </Modal>
            )}
            {!isEdit && (
                <AddPharmacy isOpen={openAddModal} onClose={() => setOpenAddModal(false)} personalInfo={contact} />
            )}
        </>
    );
};

export default PharmacyTable;
