import React from "react";
import ArrowForwardWithCircle from "../Icons/ArrowForwardWithCirlce";
import AddCircleOutline from "../Icons/AddCircleOutline";
import Typography from "@mui/material/Typography";
import Modal from "components/Modal";

import PrescriptionList from "./PrescriptionList";

import "./style.scss";

const transformPrescriptionOptions = (option) => {
  const {
    drugName,
    drugType,
    drugID,
    referenceNDC,
    genericDrugID,
    genericDrugType,
    genericDrugName,
  } = option;
  return {
    label: drugName,
    drugName,
    description: drugType,
    value: drugID,
    ndc: referenceNDC,
    g_value: genericDrugID,
    g_description: genericDrugType ? genericDrugType : "Generic",
    g_label: genericDrugName,
  };
};

const PrescriptionCoverageModal = ({ prescriptions, onClose, open }) => {
  const list = (prescriptions || []).map(transformPrescriptionOptions);

  console.log("PrescriptionCoverageModal prescriptions", list);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={"Prescription Coverage"}
      customFooter={<div> + ADD NEW </div>}
      hideFooter={true}
    >
      <PrescriptionList prescriptions={list} multiple={true} />
    </Modal>
  );
};
export default PrescriptionCoverageModal;
