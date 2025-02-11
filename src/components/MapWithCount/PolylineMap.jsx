import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import PropTypes from "prop-types";

export const PolylineMap = ({ points }) => {
    const map = useMap();

    useEffect(() => {
        if (map && window.google) {
            // Create the outer polyline (light grey outline)
            const outlinePolyline = new window.google.maps.Polyline({
                path: points,
                geodesic: true,
                strokeColor: "lightgrey",
                strokeWeight: 5,
                strokeOpacity: 1,
            });

            // Create the inner polyline (white line on top)
            const polyline = new window.google.maps.Polyline({
                path: points,
                geodesic: true,
                strokeColor: "#FFFFFF",
                strokeWeight: 3,
                strokeOpacity: 1,
            });

            outlinePolyline.setMap(map);
            polyline.setMap(map);
        }
    }, [map, points]);

    return null;
};

PolylineMap.propTypes = {
    points: PropTypes.arrayOf(
        PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
        })
    ).isRequired,
};
