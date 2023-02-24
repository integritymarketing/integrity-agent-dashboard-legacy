import React from "react";
import SectionContainer from "mobile/Components/SectionContainer";
import CopyPersonalURL from "components/ui/CopyPersonalURL";

const AgentWebsite = ({ npn, ...props }) => {
  return (
    <div className={"mt-4"}>
      <SectionContainer title={"Personal Agent Website"}>
        <CopyPersonalURL agentnpn={npn} />
      </SectionContainer>
    </div>
  );
};

export default AgentWebsite;
