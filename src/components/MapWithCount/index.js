import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";
import { MarkerWithInfoWindow } from "./MarkerWithInfoWindow";
import WithLoader from "components/ui/WithLoader";
import useUserProfile from "hooks/useUserProfile";
import { useClientServiceContext } from "services/clientServiceProvider";
import { PolylineMap } from "./PolylineMap";
import PropTypes from "prop-types";
import Map from "components/Map";
import { useContactMapMakersDataContext } from "providers/ContactMapMarkersDataProvider";
import { getOverlappingMarker } from "utils/getOverlappingMarker";
import { generateSpiderfy } from "utils/generateSpiderfy";

function MapWithCount({ selectedAgent, setSelectedAgent }) {
    const [mapMarkers, setMapMarkers] = useState(null);
    const { tableData } = useContactsListContext();

    const { contactsData, setTableData } = useContactMapMakersDataContext();
    const isClusteredClicked = useRef(false);
    const isLocationCenterSet = useRef(false);
    const { agentId } = useUserProfile();
    const { clientsService } = useClientServiceContext();
    const [isMapLoading, setIsMapLoading] = useState(true);
    const [isMapUILoading, setIsMapUILoading] = useState(true);
    const [center, setCenter] = useState({
        lat: 32.779167,
        lng: -96.808891,
    });
    const [zoom, setZoom] = useState(4);
    const [isSpiderfier, setIsSpiderfier] = useState(false);
    const [polylineData, setPolylineData] = useState([]);

    const handleCenterChange = useCallback((e) => {
        setCenter(e.detail.center);
    }, []);

    useEffect(() => {
        setTableData(tableData);
    }, [tableData, setTableData]);

    const contactsDataByZipCode = useMemo(() => {
        const groupedByPostCode = {};
        contactsData?.forEach((item) => {
            if (groupedByPostCode[item.postalCode]) {
                groupedByPostCode[item.postalCode].agents.push(item);
            } else {
                groupedByPostCode[item.postalCode] = {
                    isCluster: true,
                    postalCode: item.postalCode,
                    agents: [item],
                };
            }
        });
        const groupedArray = [];
        let centerPosition = {};
        let highestCount = 0;
        Object.values(groupedByPostCode).forEach((item) => {
            let currPosition = {};
            if (item.agents.length === 1) {
                currPosition = {
                    lat: item.agents[0]?.addresses?.[0]?.latitude,
                    lng: item.agents[0]?.addresses?.[0]?.longitude,
                };
                groupedArray.push({
                    ...item.agents[0],
                    agents: item.agents,
                    isCluster: false,
                    postalCode: item.postalCode,
                    position: currPosition,
                });
            } else {
                let totalLat = 0;
                let totalLng = 0;
                item.agents.forEach((agent) => {
                    totalLat += agent?.addresses?.[0]?.latitude;
                    totalLng += agent?.addresses?.[0]?.longitude;
                });
                currPosition = { lat: totalLat / item.agents.length, lng: totalLng / item.agents.length };
                groupedArray.push({
                    ...item,
                    position: currPosition,
                });
            }
            if (item.agents.length > highestCount) {
                highestCount = item.agents.length;
                centerPosition = currPosition;
            }
        });
        if (Object.keys(centerPosition).length && !isLocationCenterSet.current) {
            setCenter(centerPosition);
        }
        return groupedArray;
    }, [contactsData, setCenter]);

    const checkWhetherMarkersAreSpiderfy = useCallback((marker) => {
        const overlappingData = getOverlappingMarker(marker);
        if (Object.keys(overlappingData).length < marker.length) {
            setIsSpiderfier(true);
            const multiplePolylineCoordinates = [];
            let overallSpiderfyMarkersData = [];
            Object.keys(overlappingData).forEach((overLapp) => {
                const tempMarkerArray = [];
                overlappingData[overLapp].forEach((markerSet) => {
                    tempMarkerArray.push(marker[markerSet]);
                });
                if (tempMarkerArray.length > 1) {
                    const { polylineCoordinates, spiderfyMarkersData } = generateSpiderfy(
                        JSON.parse(JSON.stringify(tempMarkerArray)),
                        zoom
                    );
                    multiplePolylineCoordinates.push([...polylineCoordinates]);
                    overallSpiderfyMarkersData = [...overallSpiderfyMarkersData, ...spiderfyMarkersData];
                } else {
                    overallSpiderfyMarkersData = [...overallSpiderfyMarkersData, ...tempMarkerArray];
                }
            });

            setMapMarkers([...overallSpiderfyMarkersData]);
            setPolylineData([...multiplePolylineCoordinates]);
        } else {
            setMapMarkers(marker);
        }
    }, [zoom]);

    const handleZoomChange = useCallback((e) => {
        const newZoom = e.detail.zoom;
        if (newZoom < 14 && isClusteredClicked.current) {
            isClusteredClicked.current = false;
            setMapMarkers(null);
            setPolylineData([]);
            setIsSpiderfier(false);
        }
        if (newZoom > 12 && !isClusteredClicked.current) {
            isClusteredClicked.current = true;
            const allMarkers = [];
            contactsDataByZipCode.forEach((item) => {
                allMarkers.push(...item.agents);
            });
            checkWhetherMarkersAreSpiderfy(allMarkers);
        }
        setZoom((currZoom) => {
            if (newZoom < 17 && newZoom > currZoom) {
                return newZoom + 3 > 17 ? 17 : newZoom + 2;
            } else {
                return newZoom - 2;
            }
        });
    }, [checkWhetherMarkersAreSpiderfy, contactsDataByZipCode]);

    const handleMarkerClick = useCallback(
        (contactGroupItem) => {
            if (contactGroupItem.isCluster) {
                checkWhetherMarkersAreSpiderfy(contactGroupItem.agents);
                setCenter(contactGroupItem.position);
                setZoom(15);
                isClusteredClicked.current = true;
            } else {
                setSelectedAgent(contactGroupItem);
                setCenter(contactGroupItem.position);
            }
        },
        [checkWhetherMarkersAreSpiderfy, setSelectedAgent]
    );

    useEffect(() => {
        if (!isLocationCenterSet.current) {
            const successPosition = (position) => {
                isLocationCenterSet.current = true;
                setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
            };
            const errorPosition = async () => {
                const response = await clientsService.getAgentAvailability(agentId);
                if (response?.latitude && response?.longitude) {
                    setCenter({ lat: response.latitude, lng: response.longitude });
                    isLocationCenterSet.current = true;
                }
            };
            navigator.geolocation.getCurrentPosition(successPosition, errorPosition);
        }
    }, [clientsService, agentId]);

    const handleWindowClose = useCallback(() => {
        setSelectedAgent(null);
    }, [setSelectedAgent]);

    return (
        <div className={styles.mapContainer}>
            <WithLoader isLoading={isMapUILoading}></WithLoader>
            {mapMarkers?.length ? (
                <Map
                    center={center}
                    maxZoom={17}
                    onTilesLoaded={(e) => {
                        setIsMapLoading(false);
                    }}
                    minZoom={0}
                    style={{ visibility: isMapLoading ? "hidden" : "initial" }}
                    keyboardShortcuts={false}
                    key={mapMarkers?.length}
                    zoom={zoom}
                    setIsMapUILoading={setIsMapUILoading}
                    isMapUILoading={isMapUILoading}
                    handleZoomChange={handleZoomChange}
                    handleCenterChange={handleCenterChange}
                >
                    {mapMarkers.map((item, index) => (
                        <MarkerWithInfoWindow
                            key={`${item.postalCode} ${index}`}
                            handleClose={handleWindowClose}
                            selectedAgent={selectedAgent}
                            handleMarkerClick={handleMarkerClick}
                            contactGroupItem={item}
                        />
                    ))}
                    {mapMarkers && isSpiderfier && polylineData?.length
                        ? polylineData.map((polyinePoints, index) => <PolylineMap key={index} points={polyinePoints} />)
                        : ""}
                </Map>
            ) : (
                <Map
                    center={center}
                    key={mapMarkers?.length}
                    zoom={zoom}
                    setIsMapUILoading={setIsMapUILoading}
                    isMapUILoading={isMapUILoading}
                    handleZoomChange={handleZoomChange}
                    handleCenterChange={handleCenterChange}
                >
                    {contactsDataByZipCode.map((item, index) => (
                        <MarkerWithInfoWindow
                            key={`${item.postalCode} ${index}`}
                            handleClose={handleWindowClose}
                            selectedAgent={selectedAgent}
                            handleMarkerClick={handleMarkerClick}
                            contactGroupItem={item}
                        />
                    ))}
                </Map>
            )}
        </div>
    );
}

MapWithCount.propTypes = {
    selectedAgent: PropTypes.object,
    setSelectedAgent: PropTypes.func.isRequired,
};

export default MapWithCount;
