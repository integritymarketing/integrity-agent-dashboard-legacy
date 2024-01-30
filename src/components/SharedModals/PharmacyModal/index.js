import * as Sentry from "@sentry/react";
import React, { useEffect, useMemo, useState } from "react";

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

import clientsService from "services/clientsService";

import "./style.scss";

import AddCircleOutline from "../Icons/AddCircleOutline";
import ArrowForwardWithCirlce from "../Icons/ArrowForwardWithCirlce";
import ErrorState from "../SharedComponents/ErrorState";
import SearchInput from "../SharedComponents/SearchInput";
import SearchLabel from "../SharedComponents/SearchLabel";
import PharmacyList from "./PharmacyList";

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
    },
    maxAddresses: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        backgroundColor: "#F1FAFF",
        alignItems: "center",
        padding: "10px",
        marginTop: "10px",
        borderRadius: "8px",
        border: "solid 1px #f44236",
    },
    maxAddressesMessage: {
        color: "#052A63",
        fontSize: "20px",
        marginLeft: "10px",
    },
    boldMessage: {
        fontWeight: "bold",
    },
}));

const PharmacyModal = ({ open, onClose, userZipCode, refresh, leadId }) => {
    const { addPharmacy } = useHealth();

    // Initializations
    const classes = useStyles();
    const { fireEvent } = useAnalytics();

    const [zipCode, setZipCode] = useState(userZipCode);
    const [searchString, setSearchString] = useState("");
    const [radius, setRadius] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState();
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10);

    const [selectedPharmacy, setSelectedPharmacy] = useState(null);

    const [pharmacyAddress, setPharmacyAddress] = useState("");
    const [latLng, setLatLng] = useState("");

    const totalPages = results ? Math.ceil(total / perPage) : 0;

    useEffect(() => {
        if (open) {
            fireEvent("event-modal-appear", {
                modalName: "Add Pharmacy",
            });
        }
    }, [open]);

    useEffect(() => {
        if (!zipCode || zipCode?.length !== 5) {
            setIsLoading(false);
            setLatLng("");
            setResults();
            setTotal(0);
            return;
        }
        clientsService
            .getLatlongByAddress(zipCode, pharmacyAddress)
            .then((data) => {
                if (data?.features?.length > 0 && data?.features[0]?.center) {
                    // mapbox returns longitude/latitude, so need to reverse order for
                    // the pharmacy search API.
                    let latlan_value = data?.features[0]?.center.reverse().toString();
                    setLatLng(latlan_value);
                } else {
                    setLatLng("");
                }
            })
            .catch((e) => {
                Sentry.captureException(e);
            });
    }, [zipCode, pharmacyAddress]);

    useEffect(() => {
        if (!zipCode || zipCode?.length !== 5) {
            setIsLoading(false);
            setResults([]);
            setTotal(0);
            return;
        }

        let payload = {
            take: perPage,
            skip: perPage * (currentPage - 1),
            fields: "",
            radius: radius,
            zip: zipCode,
            latLng: latLng,
            pharmacyName: searchString,
            pharmacyAddress: pharmacyAddress,
            planPharmacyType: "",
            pharmacyIDType: 0,
        };

        setIsLoading(true);
        clientsService
            .searchPharmacies(payload)
            .then((data) => {
                setIsLoading(false);
                if (data?.pharmacyList?.length > 0) {
                    setResults(data?.pharmacyList);
                    setTotal(data.totalCount);
                } else {
                    setResults([]);
                    setTotal(0);
                }
            })
            .catch((e) => {
                setIsLoading(false);
            });
    }, [perPage, currentPage, searchString, pharmacyAddress, latLng, zipCode, radius]);

    const handleZipCode = (e) => {
        setZipCode(e.target.value);
        setPharmacyAddress("");
        setCurrentPage(1);
        if (!e.target.value || e.target.value.length < 5) {
            setSearchString("");
        }
    };

    const handleAddPharmacy = async () => {
        await addPharmacy(
            {
                pharmacyID: selectedPharmacy.pharmacyID,
                name: selectedPharmacy.name,
                address1: selectedPharmacy.address1,
                address2: selectedPharmacy.address2,
                city: selectedPharmacy.city,
                zip: selectedPharmacy.zip,
                state: selectedPharmacy.state,
                pharmacyPhone: selectedPharmacy.pharmacyPhone,
            },
            refresh,
            leadId
        );

        onClose();
    };

    const isFormValid = useMemo(() => {
        return Boolean(zipCode?.length === 5 && radius && selectedPharmacy);
    }, [selectedPharmacy, zipCode, radius]);

    const ERROR_STATE = zipCode?.length !== 5 ? true : false;

    return (
        <Modal
            open={open}
            onClose={onClose}
            onCancel={onClose}
            title={"Add Pharmacy"}
            onSave={handleAddPharmacy}
            actionButtonName={"Add Pharmacy"}
            actionButtonDisabled={!isFormValid}
            endIcon={selectedPharmacy ? <AddCircleOutline /> : <ArrowForwardWithCirlce />}
        >
            <SearchLabel label={"Search for a Pharmacy"} />

            <Grid container spacing={2}>
                <Grid item xs={5} md={3}>
                    <Box>
                        <Typography className={classes.customTypography}>Zip Code</Typography>
                        <TextField
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
                            options={DISTANCE_OPTIONS}
                            placeholder="select"
                            onChange={(value) => {
                                setRadius(value);
                                setSelectedPharmacy(null);
                                setCurrentPage(1);
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box>
                        <Typography className={classes.customTypography}>Address</Typography>
                        <TextField
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={pharmacyAddress}
                            disabled={zipCode?.length !== 5}
                            onChange={(e) => {
                                setPharmacyAddress(e.target.value);
                                setCurrentPage(1);
                                setSelectedPharmacy(null);
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Box marginTop={"10px"}>
                <Typography className={classes.customTypography}>Pharmacy Name</Typography>
                <SearchInput
                    searchString={searchString}
                    total={total}
                    handleSearch={(e) => {
                        setSearchString(e.target.value);
                        setCurrentPage(1);
                        setSelectedPharmacy(null);
                    }}
                    label={"Pharmacies"}
                />
            </Box>

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
                            <PharmacyList
                                list={results}
                                setSelectedPharmacy={setSelectedPharmacy}
                                selectedPharmacy={selectedPharmacy}
                            />
                            {zipCode && totalPages >= 1 && (
                                <Box className={classes.pagination}>
                                    <Pagination
                                        providerPagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalResults={results?.total}
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

export default PharmacyModal;
