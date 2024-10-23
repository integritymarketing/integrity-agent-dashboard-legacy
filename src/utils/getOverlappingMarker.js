export const getOverlappingMarker = (markers) => {
    return markers.reduce((acc, current, currentIndex) => {
        const key = `${current.position.lat},${current.position.lng}`;
        if (acc[key]) {
            acc[key] = [...acc[key], currentIndex];
        } else {
            acc[key] = [currentIndex];
        }
        return acc;
    }, {});
};
