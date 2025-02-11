import * as Sentry from "@sentry/react";
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

import { useHealth } from "providers/ContactDetails/ContactDetailsContext";
import useAnalytics from "hooks/useAnalytics";

import Modal from "components/Modal";
import Pagination from "components/ui/Pagination/pagination";
import { Select } from "components/ui/Select";
import Spinner from "components/ui/Spinner";

import { useClientServiceContext } from "services/clientServiceProvider";
import styles from "./styles.module.scss";

import AddCircleOutline from "../Icons/AddCircleOutline";
import ArrowForwardWithCircle from "../Icons/ArrowForwardWithCircle";
import InfoBlue from "components/icons/version-2/InfoBlue";
import ErrorState from "../SharedComponents/ErrorState";
import SearchInput from "../SharedComponents/SearchInput";
import SearchLabel from "../SharedComponents/SearchLabel";
import PharmacyList from "./PharmacyList";
import { Tab, Tabs } from "@mui/material";
import { PhysicalPharmacy, OnlinePharmacy } from "@integritymarketing/icons";

const DISTANCE_OPTIONS = [
    { value: 10, label: "10 miles" },
    { value: 20, label: "20 miles" },
    { value: 30, label: "30 miles" },
];

const useStyles = makeStyles(() => ({
    customTypography: {
        color: "#052A63 !important",
        fontSize: "16px !important",
        fontFamily: "Lato",
        letterSpacing: "0.16px !important",
        fontWeight: "bold !important",
        marginBottom: "5px !important",
    },
    input: {
        "&.MuiOutlinedInput-input": {
            padding: "10px 14px",
        },
    },
    spinner: {
        color: "#4178FF",
    },
    pagination: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
    },
    maxPharmacies: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        backgroundColor: "#F1FAFF",
        alignItems: "center",
        padding: "14px",
        marginTop: "5px",
        borderRadius: "8px",
    },
    maxPharmaciesMessage: {
        color: "#434A51",
        fontSize: "14px",
        marginBottom: "3px",
        marginLeft: "10px",
    },
    boldMessage: {
        fontWeight: "bold",
    },
    tabs: {
        margin: "15px 0",
    },
    tab: {
        display: "flex !important",
        gap: "10px !important",
        fontWeight: "normal !important",
        height: "46px",
        fontFamily: "Lato, sans-serif",
    },
    selectedTab: {
        backgroundColor: "#F1FAFF !important",
        fontWeight: "bold !important",
    },
}));

const PharmacyModal = ({ open, onClose, pharmaciesPreSelected, userZipCode, refresh, leadId }) => {
    const { addPharmacy, pharmacies } = useHealth();
    const { clientsService } = useClientServiceContext();
    const classes = useStyles();
    const { fireEvent } = useAnalytics();

    const [zipCode, setZipCode] = useState(userZipCode || "");
    const [searchString, setSearchString] = useState("");
    const [tabSelected, setTabSelected] = useState(0);
    const [radius, setRadius] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10);
    const [selectedPharmacies, setSelectedPharmacies] = useState(pharmaciesPreSelected || []);
    const [pharmacyAddress, setPharmacyAddress] = useState("");
    const [latLng, setLatLng] = useState("");

    const totalPages = results ? Math.ceil(total / perPage) : 0;

    useEffect(() => {
        if (open) {
            fireEvent("event-modal-appear", {
                modalName: "Add Pharmacy",
            });
        }
    }, [fireEvent, open]);
    useEffect(() => {
        if (!zipCode || zipCode?.length !== 5) {
            setIsLoading(false);
            setLatLng("");
            setResults([]);
            setTotal(0);
            return;
        }
        clientsService
            .getLatlongByAddress(zipCode, pharmacyAddress)
            .then((data) => {
                if (data?.features?.length > 0 && data?.features[0]?.center) {
                    const latLngValue = data?.features[0]?.center.reverse().toString();
                    setLatLng(latLngValue);
                } else {
                    setLatLng("");
                }
            })
            .catch((e) => {
                Sentry.captureException(e);
            });
    }, [zipCode, pharmacyAddress, clientsService]);

    useEffect(() => {
        if (!zipCode || zipCode?.length !== 5) {
            setIsLoading(false);
            setResults([]);
            setTotal(0);
            return;
        }

        const payload = {
            take: perPage,
            skip: perPage * (currentPage - 1),
            fields: "",
            radius,
            zip: zipCode,
            latLng,
            pharmacyName: searchString,
            pharmacyAddress,
            planPharmacyType: "",
            pharmacyIDType: 0,
        };

        setIsLoading(true);
        clientsService
            .searchPharmacies(payload, tabSelected === 1)
            .then((data) => {
                setIsLoading(false);
                if (data?.pharmacyList?.length > 0) {
                    setResults(data.pharmacyList);
                    setTotal(data.totalCount);
                } else {
                    setResults([]);
                    setTotal(0);
                }
            })
            .catch((e) => {
                setIsLoading(false);
                Sentry.captureException(e);
            });
    }, [perPage, currentPage, tabSelected, searchString, pharmacyAddress, latLng, zipCode, radius, clientsService]);

    const handleZipCode = (e) => {
        setZipCode(e.target.value);
        setPharmacyAddress("");
        setCurrentPage(1);
        if (!e.target.value || e.target.value.length < 5) {
            setSearchString("");
        }
    };

    const handleAddPharmacy = async () => {
        const existingPrimary = selectedPharmacies.some((pharmacy) => pharmacy.isPrimary);

        await addPharmacy(
            [
                ...selectedPharmacies.filter((item) => Boolean(item.pharmacyId)),
                ...selectedPharmacies
                    .filter((item) => !item.pharmacyId)
                    .map((pharmacy, index) => ({
                        address1: pharmacy.address1,
                        address2: pharmacy.address2,
                        city: pharmacy.city,
                        isDigital: pharmacy.isDigital,
                        isPrimary: !existingPrimary && index === 0,
                        name: pharmacy.name,
                        pharmacyID: pharmacy.pharmacyID,
                        pharmacyIDType: pharmacy.pharmacyIDType,
                        pharmacyPhone: pharmacy.pharmacyPhone,
                        state: pharmacy.state,
                        zip: pharmacy.zip,
                    })),
            ],
            refresh,
            leadId,
        );

        onClose();
    };

    const handleTabChange = (tabNew) => {
        setTabSelected(tabNew);
        setSearchString("");
    };

    const isFormValid = useMemo(() => {
        return Boolean(zipCode?.length === 5 && radius && selectedPharmacies.length);
    }, [selectedPharmacies, zipCode, radius]);

    const ERROR_STATE = zipCode?.length !== 5;
    const pharmacyCountExceeded = selectedPharmacies.length >= 3;

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeButtonSx={{ border: "solid 1px #cccccc" }}
            onCancel={onClose}
            title={"Add Pharmacy"}
            onSave={handleAddPharmacy}
            actionButtonName={"Add Pharmacy"}
            actionButtonDisabled={!isFormValid}
            endIcon={selectedPharmacies.length > 0 ? <ArrowForwardWithCircle /> : <AddCircleOutline />}
        >
            {pharmacyCountExceeded && (
                <Box className={classes.maxPharmacies}>
                    <InfoBlue />
                    <div className={classes.maxPharmaciesMessage}>
                        You may select up to 3 pharmacies, including physical and online options
                    </div>
                </Box>
            )}

            {tabSelected === 0 && <SearchLabel label={"Search for a Pharmacy"} />}

            {tabSelected === 0 && (
                <Grid container spacing={2}>
                    <Grid item xs={5} md={3}>
                        <Box>
                            <Typography className={classes.customTypography}>Zip Code</Typography>
                            <TextField
                                sx={{ backgroundColor: "#FFFFFF" }}
                                id="Zip Code"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={zipCode}
                                onChange={handleZipCode}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={5} md={3}>
                        <Box>
                            <Typography className={classes.customTypography}>Distance</Typography>
                            <Select
                                PharmacyModal={true}
                                initialValue={10}
                                selectContainerClassName={styles.distanceSelectContainer}
                                inputBoxClassName={styles.distanceInputBox}
                                options={DISTANCE_OPTIONS}
                                placeholder="select"
                                onChange={(value) => {
                                    setRadius(value);
                                    setCurrentPage(1);
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography className={classes.customTypography}>Address</Typography>
                            <TextField
                                sx={{ backgroundColor: "#FFFFFF" }}
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={pharmacyAddress}
                                disabled={zipCode?.length !== 5}
                                onChange={(e) => {
                                    setPharmacyAddress(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            )}
            {tabSelected === 0 && (
                <Box marginTop={"10px"}>
                    <Typography className={classes.customTypography}>Pharmacy Name</Typography>
                    <SearchInput
                        searchString={searchString}
                        total={total}
                        handleSearch={(e) => {
                            setSearchString(e.target.value);
                            setCurrentPage(1);
                        }}
                        label={"Pharmacies"}
                    />
                </Box>
            )}

            {isLoading ? (
                <div className={classes.spinner}>
                    <Spinner />
                </div>
            ) : (
                <>
                    {ERROR_STATE ? (
                        <ErrorState
                            searchString={searchString}
                            list={results}
                            title={"Pharmacy"}
                            defaultMessage={zipCode?.length !== 5 ? "Zip code must be 5 digits" : null}
                        />
                    ) : (
                        <>
                            <Tabs
                                TabIndicatorProps={{
                                    sx: {
                                        height: "2px",
                                    },
                                }}
                                TabScrollButtonProps={{
                                    sx: {
                                        border: "solid 1px red",
                                    },
                                }}
                                className={classes.tabs}
                                value={tabSelected}
                                aria-label="tabs"
                                variant="fullWidth"
                            >
                                <Tab
                                    className={`${classes.tab} ${tabSelected === 0 ? classes.selectedTab : ""}`}
                                    icon={<PhysicalPharmacy />}
                                    onClick={() => handleTabChange(0)}
                                    iconPosition="start"
                                    label={"Physical"}
                                />
                                <Tab
                                    className={`${classes.tab} ${tabSelected === 1 ? classes.selectedTab : ""}`}
                                    icon={<OnlinePharmacy />}
                                    onClick={() => handleTabChange(1)}
                                    iconPosition="start"
                                    label={"Online"}
                                />
                            </Tabs>
                            <PharmacyList
                                list={results}
                                selectedPharmacies={selectedPharmacies}
                                setSelectedPharmacies={setSelectedPharmacies}
                            />
                            {zipCode && totalPages >= 1 && (
                                <Box className={classes.pagination}>
                                    <Pagination
                                        providerPagination
                                        isSeparateBoxes
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalResults={total}
                                        pageSize={perPage}
                                        onPageChange={(pageIndex) => setCurrentPage(pageIndex)}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </>
            )}
        </Modal>
    );
};

PharmacyModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userZipCode: PropTypes.string.isRequired,
    refresh: PropTypes.func.isRequired,
    leadId: PropTypes.string.isRequired,
};

export default PharmacyModal;
