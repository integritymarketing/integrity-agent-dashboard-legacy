import React, { useRef, useEffect } from "react";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

export default ({ data = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
    });
    return () => map.current.remove();
  });

  useEffect(() => {
    const features = data.map(({ lat, lng }, idx) => ({
        id: idx,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lat, lng],
      },
    }));
    const stores = {
        features,
        type: "FeatureCollection",
    }
    map.current.on('load', function (e) {
        /* Add the data to your map as a layer */
        map.current.addLayer({
          "id": "locations",
          "type": "circle",
          /* Add a GeoJSON source containing place coordinates and information. */
          "source": {
            "type": "geojson",
            "data": stores
          }
        });
        map.current.fitBounds(data.map(({ lat, lng }) => [lat, lng]), {
            padding: { top: 10, right: 10, bottom: 10, left: 10}
        })
      });
  }, [data]);

  return <div ref={mapContainer} className="map-container" />;
};
