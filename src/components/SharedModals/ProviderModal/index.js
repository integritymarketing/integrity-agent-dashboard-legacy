import React, { useState, useEffect, useMemo } from "react";
import AddCircleOutline from "../Icons/AddCircleOutline";
import ArrowForwardWithCirlce from "../Icons/ArrowForwardWithCirlce";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import makeStyles from "@mui/styles/makeStyles";
import ErrorState from "../SharedComponents/ErrorState";
import Modal from "components/Modal";
import { useClientServiceContext } from "services/clientServiceProvider";
import SearchInput from "../SharedComponents/SearchInput";
import SearchLabel from "../SharedComponents/SearchLabel";
import { Select } from "components/ui/Select";
import ProviderList from "./ProviderList";
import * as Sentry from "@sentry/react";
import Spinner from "components/ui/Spinner";
import Pagination from "components/ui/Pagination/pagination";

import "./style.scss";

const DISTANCE_OPTIONS = [
  { value: 10, label: "10 miles" },
  { value: 20, label: "20 miles" },
  { value: 30, label: "30 miles" },
];

function encodeQueryData(data) {
  const ret = [];
  for (let d in data)
    if (data[d]) {
      ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
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
}));

const ProviderModal = ({
  open,
  onClose,
  userZipCode,
  leadId,
  leadProviders,
  onDelete,
  onSave,
  isEdit,
  selected,
}) => {
  // Initializations
  const classes = useStyles();
  const { clientsService } = useClientServiceContext();

  const [zipCode, setZipCode] = useState(userZipCode);
  const [searchString, setSearchString] = useState("");
  const [radius, setRadius] = useState(10);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState();

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectAddressId, setSelectAddressId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const providerList = isEdit ? [{ ...selected }] : results?.providers;
  const totalPages = results ? Math.ceil(results.total / perPage) : 0;

  // useEffects

  useEffect(() => {
    if (!zipCode || zipCode.length !== 5 || !searchString || isEdit) {
      setIsLoading(false);
      setResults([]);
      return;
    }
    const query = encodeQueryData({
      searchTerm: searchString,
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
      })
      .catch((e) => {
        setIsLoading(false);
        Sentry.captureException(e);
      });
  }, [
    perPage,
    currentPage,
    searchString,
    zipCode,
    radius,
    clientsService,
    isEdit,
  ]);

  useEffect(() => {
    if (isEdit && selected) {
      setSelectedProvider(selected);
      setSelectAddressId(selected?.addresses[0]?.id);
    }
  }, [isEdit, selected]);

  // Event Handlers

  const handleZipCode = (e) => {
    setZipCode(e.target.value);
    setCurrentPage(1);
    if (!e.target.value || e.target.value.length < 5) {
      setSearchString("");
    }
  };

  const handleSaveProvider = async () => {
    // let isExist =
    //   leadProviders?.filter((each) => each?.NPI === selectedProvider?.NPI)[0] ||
    //   null;
    // if (isExist) {
    //   await handleDeleteProvider();
    // } else {
    await onSave(
      selectedProvider?.addresses[0]?.id,
      leadId,
      selectedProvider?.NPI,
      selectedProvider?.presentationName
    );
    onClose();
    // }
  };

  const handleDeleteProvider = () => {
    onClose();
    onDelete(
      selectAddressId,
      leadId,
      selectedProvider?.NPI,
      selectedProvider?.presentationName
    );
  };

  const isFormValid = useMemo(() => {
    return Boolean(
      zipCode?.length === 5 && radius && selectAddressId && selectedProvider
    );
  }, [selectedProvider, zipCode, radius, selectAddressId]);

  const ERROR_STATE = !isEdit
    ? zipCode?.length !== 5
      ? true
      : searchString?.length === 0 || providerList?.length === 0
    : false;

  const disabled = isEdit ? !selectAddressId : !isFormValid;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Update Provider" : "Add Provider"}
      onSave={handleSaveProvider}
      actionButtonName={isEdit ? "Update Provider" : "Add Provider"}
      isDelete={isEdit}
      modalName={"Provider"}
      onDelete={handleDeleteProvider}
      actionButtonDisabled={disabled}
      endIcon={
        selectedProvider ? <AddCircleOutline /> : <ArrowForwardWithCirlce />
      }
    >
      <SearchLabel
        label={
          isEdit ? "Add or change provider location" : "Search for a Provider"
        }
      />
      {!isEdit && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={5} md={6}>
              <Box>
                <Typography className={classes.customTypography}>
                  Zip Code
                </Typography>
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
            <Grid item xs={5} md={6}>
              <Box>
                <Typography className={classes.customTypography}>
                  Distance
                </Typography>
                <Select
                  providerModal={true}
                  initialValue={10}
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
            list={providerList}
            handleSearch={(e) => {
              setSearchString(e.target.value);
              setCurrentPage(1);
            }}
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
              defaultMessage={"zipcode must be 5 digits"}
            />
          ) : (
            <>
              <ProviderList
                list={providerList}
                onProviderSelection={setSelectedProvider}
                selectAddressId={selectAddressId}
                setSelectAddressId={setSelectAddressId}
                selectedProvider={selectedProvider}
              />
              {zipCode && totalPages > 1 && (
                <Box className={classes.pagination}>
                  <Pagination
                    providerPagination
                    currentPage={currentPage}
                    totalPages={totalPages - 1}
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

export default ProviderModal;
