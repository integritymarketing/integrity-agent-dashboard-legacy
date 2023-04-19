import * as React from "react";
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
  },
}));

export default function BasicTooltip({ title, props }) {
  return (
    <BootstrapTooltip title={title} arrow placement="right">
      <span>
        <Info />
      </span>
    </BootstrapTooltip>
  );
}
