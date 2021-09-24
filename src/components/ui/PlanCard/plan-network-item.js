import React from "react";
import InNetworkCheck from "components/icons/in-network-check";
import OutNetworkX from "components/icons/out-network-x";
import UnknownNetworkCheck from "components/icons/unknown-network-check";

function getNetworkIcon(inNetwork, isPlanNetworkAvailable) {
  if (isPlanNetworkAvailable === false) {
    return <UnknownNetworkCheck />;
  }
  return inNetwork ? <InNetworkCheck /> : <OutNetworkX />;
}

export default ({
  name,
  address,
  inNetwork,
  isMobile,
  isPlanNetworkAvailable,
}) => {
  return (
    <div className={"network-item"}>
      <div>
        <div className={"icon"}>
          {getNetworkIcon(inNetwork, isPlanNetworkAvailable)}
        </div>
        <div className={"text"}>
          <div className={"name"}>{name}</div>
          {!isMobile && <div className={"address"}>{address}</div>}
        </div>
      </div>
    </div>
  );
};
