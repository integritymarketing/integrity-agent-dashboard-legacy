import React from "react";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import styles from "./prescription-table.module.scss";
import Header from "./components/Header";
import Row from "./components/Row";
import Footer from "./components/Footer";
import Edit from "./components/Edit";

function PrescriptionTable({ isMobile }) {
  return (
    <PlanDetailsContactSectionCard
      title="Prescriptions"
      isDashboard={true}
      preferencesKey={"costTemp_collapse"}
      actions={<Edit />}
    >
      <Header isMobile={isMobile} />
      <Row isMobile={isMobile} />
      <Header nonPrescribed={true} isMobile={isMobile} />
      <Row isMobile={isMobile} />
      <Footer isMobile={isMobile} />
    </PlanDetailsContactSectionCard>
  );
}

export default PrescriptionTable;
