import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Info from "components/icons/info-blue";

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    width: "250px",
    fontSize: "14px",
    padding: "10px",
  },
}));

export default function BasicTooltip({ titleData, props }) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <BootstrapTooltip
      title={titleData}
      arrow
      open={showTooltip}
      onOpen={() => setShowTooltip(true)}
      onClose={() => setShowTooltip(false)}
      placement="right"
    >
      <span>
        <Info />
      </span>
    </BootstrapTooltip>
  );
}
