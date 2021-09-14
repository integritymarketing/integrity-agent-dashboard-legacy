import React from "react";
import InNetworkCheck from "components/icons/in-network-check";
import OutNetworkX from "components/icons/out-network-x";

function getNetworkIcon(inNetwork) {
  return inNetwork ? <InNetworkCheck /> : <OutNetworkX />;
}

export default ({ name, address, inNetwork, isMobile }) => {
  return (
    <div className={"network-item"}>
      <div>
        <div className={"icon"}>{getNetworkIcon(inNetwork)}</div>
        <div className={"text"}>
          <div className={"name"}>{name}</div>
          {!isMobile && <div className={"address"}>{address}</div>}
        </div>
      </div>
    </div>
  );
};
