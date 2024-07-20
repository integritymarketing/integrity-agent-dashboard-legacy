import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Info from "components/icons/info-blue";

const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: "#000000",
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#000000",
        width: "250px",
        fontSize: "14px",
        padding: "10px",
    },
}));

export default function BasicTooltip({ titleData, props, onClick }) {
    const [showTooltip, setShowTooltip] = useState(false);
    return (
        <BootstrapTooltip
            title={titleData}
            arrow
            open={showTooltip}
            onOpen={() => setShowTooltip(true)}
            onClose={() => setShowTooltip(false)}
            placement="right"
            onClick={onClick}
        >
            <span>
                <Info />
            </span>
        </BootstrapTooltip>
    );
}
