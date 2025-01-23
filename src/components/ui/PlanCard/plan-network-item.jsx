import React from "react";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";

const getNetworkIcon = (inNetwork) => {
  return inNetwork ? <InNetworkIcon /> : <OutNetworkIcon />;
};

const PlanNetworkItem = ({ name, address, inNetwork }) => {
  return (
    <div className={"network-item"}>
      <div className={inNetwork ? "netIcon" : ""}>
        {getNetworkIcon(inNetwork)}
      </div>
      <div className={"text"}>
        <div className={"name"}>{name}</div>
        <div className={"address"}>{address}</div>
      </div>
    </div>
  );
};

export default PlanNetworkItem;
