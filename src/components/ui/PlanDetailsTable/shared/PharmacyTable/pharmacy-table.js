import React, { useMemo, useState } from "react";
import APIFail from "../APIFail/index";
import PlanDetailsTableWithCollapse from "../../planDetailsTableWithCollapse";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "../../Icons/outNetwork";
import Modal from "components/Modal";
import UpdateView from "./components/UpdateView/updateView";
import AddPharmacy from "pages/contacts/contactRecordInfo/modals/AddPharmacy";

function getInNetwork(pharmacyCost) {
  return pharmacyCost.isNetwork ? <InNetworkIcon /> : <OutNetworkIcon />;
}

const PharmacyTable = ({
  contact,
  planData,
  pharmacies,
  isMobile,
  addPharmacy,
  deletePharmacy,
}) => {
  const [open, setOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const pharmaciesList =
    pharmacies?.length > 0
      ? pharmacies?.reduce((dict, item) => {
          dict[item["pharmacyID"]] = item;
          return dict;
        }, {})
      : [];

  const isApiFailed =
    pharmaciesList !== null &&
    pharmaciesList?.length > 0 &&
    (pharmaciesList?.filter((pharmacy) => pharmacy?.name)?.length > 0
      ? false
      : true);

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

  if (
    pharmacies &&
    planData?.pharmacyCosts &&
    Array.isArray(planData?.pharmacyCosts)
  ) {
    planData?.pharmacyCosts?.forEach((pharmacyCost) => {
      const pharmacy = pharmacies[0];
      if (pharmacy) {
        const row = {
          name: <span className={"label"}>{pharmacy?.name}</span>,
          address: (
            <>
              <div className={"address"}>
                <span className="networkIcon">
                  {getInNetwork(pharmacyCost)}
                </span>
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

  const isEdit = pharmacies?.length > 0;

  return (
    <>
      <PlanDetailsTableWithCollapse
        columns={isApiFailed ? columnsData : columns}
        data={isApiFailed ? rowData : data}
        className="quotes"
        header="Pharmacy"
      />
      {isEdit && (
        <Modal
          open={open}
          onClose={() => {
            setOpen(!open);
          }}
          title={"Update Pharmacy"}
          isDelete={isEdit}
          modalName={"Pharmacy"}
          onDelete={() => {
            deletePharmacy(pharmacies?.[0]);
            setOpen(!open);
            setOpenAddModal(true);
          }}
        >
          <UpdateView data={pharmacies?.[0]} />
        </Modal>
      )}
      {!isEdit && (
        <AddPharmacy
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          personalInfo={contact}
          onSave={(item) => {
            addPharmacy(item);
            setOpenAddModal(false);
          }}
        />
      )}
    </>
  );
};

export default PharmacyTable;
