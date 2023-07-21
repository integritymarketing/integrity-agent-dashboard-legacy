import React from "react";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";

function getNetworkIcon(inNetwork) {
  return inNetwork ? <InNetworkIcon /> : <OutNetworkIcon />;
}

export default ({ name, address, inNetwork, isMobile }) => {
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
