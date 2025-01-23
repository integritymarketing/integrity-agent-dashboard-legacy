import PropTypes from "prop-types";
import * as Sentry from "@sentry/react";
import { useEffect, useMemo, useState } from "react";

import useDebounce from "hooks/useDebounce";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

import { useHealth } from "providers/ContactDetails/ContactDetailsContext";

import { arraysAreEqual } from "utils/address";

import useAnalytics from "hooks/useAnalytics";

import Modal from "components/Modal";
import CustomFooter from "components/Modal/CustomFooter";
import Pagination from "components/ui/Pagination/pagination";
import { Select } from "components/ui/Select";
import Spinner from "components/ui/Spinner";

import { useClientServiceContext } from "services/clientServiceProvider";
import ProviderList from "./ProviderList";
import styles from "./styles.module.scss";

import AddCircleOutline from "../Icons/AddCircleOutline";
import ArrowForwardWithCirlce from "../Icons/ArrowForwardWithCircle";
import Warning from "../Icons/warning";
import ErrorState from "../SharedComponents/ErrorState";
import SearchInput from "../SharedComponents/SearchInput";
import SearchLabel from "../SharedComponents/SearchLabel";

const DISTANCE_OPTIONS = [
    { value: 10, label: "10 miles" },
    { value: 20, label: "20 miles" },
    { value: 30, label: "30 miles" },
    { value: 40, label: "40 miles" },
    { value: 50, label: "50 miles" },
    { value: 60, label: "60 miles" },
    { value: 70, label: "70 miles" },
    { value: 80, label: "80 miles" },
    { value: 90, label: "90 miles" },
    { value: 100, label: "100 miles" },
];

function encodeQueryData(data) {
    const ret = [];
    for (const d in data) {
        if (data[d]) {
            ret.push(`${encodeURIComponent(d)}=${encodeURIComponent(data[d])}`);
        }
    }
    return ret.join("&");
}

const useStyles = makeStyles(() => ({
    customTypography: {
        color: "#052A63",
        fontSize: 16,
        fontFamily: "Lato",
        letterSpacing: "0.16px",
        fontWeight: "bold",
        marginBottom: 10,
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

const ProviderModal = ({ open, onClose, userZipCode, isEdit, selected, refresh, leadId }) => {
    const { addProvider, deleteProvider, providers } = useHealth();
    const { clientsService } = useClientServiceContext();

    const classes = useStyles();
    const { fireEvent } = useAnalytics();

    const [zipCode, setZipCode] = useState(userZipCode);
    const [searchString, setSearchString] = useState("");
    const debouncedSearchString = useDebounce(searchString, 1000);
    const [radius, setRadius] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState();
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectAddressIds, setSelectAddressIds] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10);

    const providerList = results?.providers;
    const totalPages = results ? Math.ceil(total / perPage) : 0;
    // Merge addresses from all providers
    const mergedAddresses = providers.reduce((acc, provider) => {
        return acc.concat(provider.addresses);
    }, []);

    const addressCount = mergedAddresses?.length;

    const disableAddressSelect = isEdit
        ? addressCount + selectAddressIds?.length - selected?.addresses?.length >= 10
        : addressCount + selectAddressIds?.length >= 10;

    useEffect(() => {
        if (!zipCode || zipCode.length !== 5 || !debouncedSearchString || isEdit) {
            setIsLoading(false);
            setResults([]);
            return;
        }
        const query = encodeQueryData({
            searchTerm: debouncedSearchString,
            radius,
            zipCode,
            page: currentPage,
            perPage,
        });
        setIsLoading(true);
        clientsService
            .searchProviders(query)
            .then((resp) => {
                setIsLoading(false);
                setResults(resp);
                setTotal(resp?.total || 0);
            })
            .catch((e) => {
                setIsLoading(false);
                Sentry.captureException(e);
            });
    }, [perPage, currentPage, debouncedSearchString, zipCode, radius, isEdit]);

    useEffect(() => {
        if (isEdit && selected) {
            const query = encodeQueryData({
                NPIs: selected?.NPI?.toString(),
                page: 1,
                perPage: 10,
            });
            setIsLoading(true);
            clientsService
                .searchProviders(query)
                .then((resp) => {
                    setIsLoading(false);
                    setResults(resp);
                })
                .catch((e) => {
                    setIsLoading(false);
                    Sentry.captureException(e);
                });
            setSelectedProvider(selected);
            setSelectAddressIds(selected?.addresses?.map((address) => address.id));
        }
    }, [isEdit, selected]);

    const handleZipCode = (e) => {
        setZipCode(e.target.value);
        setCurrentPage(1);
        if (!e.target.value || e.target.value.length < 5) {
            setSearchString("");
        }
    };

    const handleSaveProvider = async () => {
        onClose();
        
        const requestPayload = selectAddressIds?.map((addressId) => {
            return {
                npi: selectedProvider?.NPI?.toString(),
                addressId: addressId,
                isPrimary: false,
            };
        });

        await addProvider(requestPayload, selectedProvider?.presentationName, refresh, isEdit, leadId);

        fireEvent("AI - Provider added", {
            leadid: leadId,
            npi: selectedProvider?.NPI,
        });
    };

    const handleEditProvider = async () => {
    const requestPayload = selected?.addresses?.map((address) => ({
        npi: selectedProvider?.NPI?.toString(),
        isPrimary: false,
        addressId: address?.id,
    }));

    onClose();
    await deleteProvider(
        requestPayload,
        selectedProvider?.presentationName,
        handleSaveProvider,
        false,
        leadId
    );
};

    const handleDeleteProvider = () => {
        const requestPayload = selected?.addresses?.map((address) => ({
            npi: selected?.NPI?.toString(),
            isPrimary: false,
            addressId: address?.id,
        }));

        onClose();
        deleteProvider(requestPayload, selected?.presentationName, refresh, true, leadId);
    };

    const isFormValid = useMemo(() => {
        return Boolean(zipCode?.length === 5 && radius && selectAddressIds?.length > 0 && selectedProvider);
    }, [selectedProvider, zipCode, radius, selectAddressIds]);

    const ERROR_STATE = !isEdit
        ? zipCode?.length !== 5
            ? true
            : searchString?.length === 0 || providerList?.length === 0
        : false;

    const onlyIds = selected?.addresses?.map((address) => address.id);

    const isUpdated = useMemo(() => {
        return !arraysAreEqual(onlyIds, selectAddressIds);
    }, [onlyIds, selectAddressIds]);

    const disabled = isEdit ? !selectAddressIds?.length > 0 || !isUpdated : !isFormValid;

    return (
        <Modal
            open={open}
            onClose={onClose}
            onCancel={onClose}
            title={isEdit ? "Update Provider" : "Add Providers"}
            onSave={isEdit ? handleEditProvider : handleSaveProvider}
            actionButtonName={isEdit ? "Update Provider" : "Add Provider"}
            customFooter={isEdit && <CustomFooter buttonName={"Delete Provider"} onClick={handleDeleteProvider} />}
            isCurved={isEdit ? false : true}
            actionButtonDisabled={disabled}
            endIcon={selectedProvider ? <AddCircleOutline /> : <ArrowForwardWithCirlce />}
        >
            {disableAddressSelect && (
                <Box className={classes.maxAddresses}>
                    <div>
                        <Warning />
                    </div>
                    <div className={classes.maxAddressesMessage}>
                        You have reached<span className={classes.boldMessage}> the maximum of 10 locations</span> for
                        your doctors.
                    </div>
                </Box>
            )}
            <SearchLabel label={isEdit ? "Add or change provider location" : "Search for a Provider"} />
            {!isEdit && (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={5} md={6}>
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
                        <Grid item xs={5} md={6}>
                            <Box>
                                <Typography className={classes.customTypography}>Distance</Typography>
                                <Select
                                    providerModal={true}
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
                    </Grid>
                    <SearchInput
                        searchString={searchString}
                        total={total}
                        handleSearch={(e) => {
                            setSearchString(e.target.value);
                            setCurrentPage(1);
                        }}
                        label={"Providers"}
                    />
                </>
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
                            list={providerList}
                            title={"Provider"}
                            defaultMessage={zipCode?.length !== 5 ? "Zip code must be 5 digits" : null}
                        />
                    ) : (
                        <>
                            <ProviderList
                                list={providerList}
                                onProviderSelection={setSelectedProvider}
                                selectAddressIds={selectAddressIds}
                                setSelectAddressIds={setSelectAddressIds}
                                selectedProvider={selectedProvider}
                                isEdit={isEdit}
                                providerToEdit={selected}
                                disableAddressSelect={disableAddressSelect}
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

ProviderModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userZipCode: PropTypes.string,
    isEdit: PropTypes.bool,
    selected: PropTypes.object,
    refresh: PropTypes.func,
    leadId: PropTypes.string,
};

ProviderModal.defaultProps = {
    userZipCode: "",
    isEdit: false,
    selected: null,
};

export default ProviderModal;
