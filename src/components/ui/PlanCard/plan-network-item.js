import React from "react";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";

function getNetworkIcon(inNetwork) {
  return inNetwork ? <InNetworkIcon /> : <OutNetworkIcon />;
}

export default ({ name, address, inNetwork, isMobile }) => {
  return (
    <div className={"network-item"}>
      <div className={inNetwork ? "netIcon" : "outIcon"}>
        {getNetworkIcon(inNetwork)}
      </div>
      <div className={inNetwork ? "text mt18" : "text"}>
        <div className={"name"}>{name}</div>
        {!isMobile && <div className={"address"}>{address}</div>}
      </div>
    </div>
  );
};
