import React, { useRef } from "react";
import ScrollNav from "./../../components/ui/ScrollNav";

export default {
  title: "Design System/ScrollNav",
  component: ScrollNav,
};

const Template = (args) => {
  const costRef = useRef(null);
  const providerRef = useRef(null);
  const prescriptionRef = useRef(null);
  const pharmacyRef = useRef(null);
  return (
    <div style={{ display: "flex", marginTop: 30 }}>
      <div>
        <ScrollNav
          {...args}
          ref={{
            costs: costRef,
            providerDetails: providerRef,
            prescriptionDetails: prescriptionRef,
            pharmacyDetails: pharmacyRef,
          }}
        />
      </div>
      <div>
        <h1 ref={costRef} style={{ height: 50 }}>
          Costs
        </h1>
        <div style={{ height: 1000 }}>some content</div>
        <h1 ref={providerRef} style={{ height: 50 }}>
          Provider
        </h1>
        <div style={{ height: 1000 }}>some content</div>
        <h1 ref={prescriptionRef}>Prescription</h1>
        <div style={{ height: 1000 }}>some content</div>
        <h1 ref={pharmacyRef}>Pharmacy</h1>
        <div style={{ height: 1000 }}>some content</div>
      </div>
    </div>
  );
};
export const DefaultScrollNav = Template.bind({});
DefaultScrollNav.args = {
  initialSectionID: "costs",
  sections: [
    {
      id: "costs",
      label: "Costs",
    },
    {
      id: "providerDetails",
      label: "Provider Details",
    },
    {
      id: "prescriptionDetails",
      label: "Prescription Details",
    },
    {
      id: "pharmacyDetails",
      label: "Pharmacy Details",
    },
  ],
};
