import React from "react";
import SectionContainer from "mobile/Components/SectionContainer";
import CopyPersonalURL from "components/ui/CopyPersonalURL";

const AgentWebsite = ({ npn }) => {
  return (
    <div className={"mt-4"}>
      <SectionContainer title={"Agent Website"}>
        <CopyPersonalURL agentnpn={npn} />
      </SectionContainer>
    </div>
  );
};

export default AgentWebsite;
