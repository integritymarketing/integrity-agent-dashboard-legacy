import { ControlPosition, Map as ReactMap } from "@vis.gl/react-google-maps";
import mapStyles from "./mapStyles.json";
import PropTypes from "prop-types";
import { useWindowSize } from "hooks/useWindowSize";
import "./mapStyle.css";

const Map = ({ center, zoom, handleZoomChange, handleCenterChange, setIsMapUILoading, isMapUILoading, children }) => {
    const { width: windowWidth } = useWindowSize();
    const isMobile = windowWidth <= 784;
    return (
        <ReactMap
            center={center}
            styles={mapStyles}
            maxZoom={17}
            onIdle={() => {
                setIsMapUILoading(false);
            }}
            reuseMaps={true}
            key={zoom}
            minZoom={4}
            style={{ visibility: isMapUILoading ? "hidden" : "initial" }}
            keyboardShortcuts={false}
            zoom={zoom}
            zoomControlOptions={{
                position: ControlPosition.RIGHT_BOTTOM,
            }}
            zoomControl={true}
            onZoomChanged={handleZoomChange}
            onCenterChanged={handleCenterChange}
            mapTypeControl={false}
            fullscreenControl={!isMobile}
            streetViewControl={false}
        >
            {children}
        </ReactMap>
    );
};
Map.propTypes = {
    center: PropTypes.object,
    zoom: PropTypes.number,
    handleZoomChange: PropTypes.func,
    handleCenterChange: PropTypes.func,
    setIsMapUILoading: PropTypes.func,
    isMapUILoading: PropTypes.bool,
    children: PropTypes.node,
};
export default Map;
