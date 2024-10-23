export const generateSpiderfy = (markers, zoom) => {
    const spiderfyDistance = 0.0075;
    const angleStep = (2 * Math.PI) / markers.length;
    const centerPosition = { ...markers[0].position };
    const polylineCoordinates = [];

    const spiderfyMarkersData = markers.map((pos, index) => {
        const angle = index * angleStep;
        pos.position.lat = pos.position.lat + (spiderfyDistance / zoom) * Math.cos(angle);
        pos.position.lng = pos.position.lng + (spiderfyDistance / zoom) * Math.sin(angle);
        polylineCoordinates.push({ ...centerPosition });
        polylineCoordinates.push({ lat: pos.position.lat, lng: pos.position.lng });
        return pos;
    });

    return { spiderfyMarkersData, polylineCoordinates };
};
