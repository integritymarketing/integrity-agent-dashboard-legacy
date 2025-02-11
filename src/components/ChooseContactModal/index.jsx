import {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {onlyAlphabets} from "utils/shared-utils/sharedUtility";
import SearchIcon from "@mui/icons-material/Search";
import {
    Autocomplete,
    CircularProgress,
    InputAdornment,
    ListItem,
    ListItemText,
    TextField,
    Typography,
    Box,
} from "@mui/material";
import {CustomModal} from "components/MuiComponents";
import {styled} from "@mui/system";
import {debounce} from "lodash";
import useToast from "hooks/useToast";
import {useClientServiceContext} from "services/clientServiceProvider";
import ContactListItem from "./ContactListItem";
import CreateNewContactIcon from "components/icons/CreateNewContact";
import ContinueIcon from "components/icons/Continue";

import styles from "./styles.module.scss";

const StyledSearchInput = styled(TextField)(() => ({
    background: "#FFFFFF 0 0 no-repeat padding-box",
    borderRadius: "4px",
    "& input::placeholder": {
        color: "#434A51",
        fontSize: "16px",
    },
}));

const AutocompleteWrapper = styled("div")({
    position: "relative",
    width: "100%",
});

const AutoCompleteContactSearchModal = ({
                                            open,
                                            handleClose,
                                            title,
                                            subTitle,
                                            handleContactSelect,
                                            isCreateNewAvailable = false,
                                            handleCancel,
                                            searchId,
                                            currentContactOption,
                                        }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [contactList, setContactList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tempLead, setTempLead] = useState(null);

    const {clientsService} = useClientServiceContext();
    const showToast = useToast();

    const handleSearchInputChange = (event, value) => {
        setSearchQuery(value);
        if (value.length >= 3) {
            if (tempLead) {
                setTempLead(null);
            }
            debouncedContactSearch(value);
        } else {
            setContactList([]);
            setTempLead(null);
        }
    };

    const handleSelectNewContact = (contact) => {
        handleContactSelect(contact, "new");
        handleClose(false);
    };

    const handleSelectOldContact = (contact) => {
        setTempLead(contact);
        setSearchQuery(`${contact.firstName} ${contact.lastName}`);
    };

    const fetchContacts = useCallback(
        async (query) => {
            setLoading(true);
            try {
                const response = await clientsService.getCampaignLeads(
                    ["CreateDate:desc"],
                    query,
                    undefined,
                    undefined,
                    searchId,
                );
                if (response) {
                    setContactList(response?.eligibleContacts);
                }
            } catch (error) {
                showToast({
                    type: "error",
                    message: `${error.message}`,
                });
            } finally {
                setLoading(false);
            }
        },
        [clientsService, showToast, searchId],
    );

    const debouncedContactSearch = useCallback(
        debounce((query) => {
            if (query.length >= 3) {
                fetchContacts(query);
            }
        }, 1000),
        [fetchContacts],
    );

    useEffect(() => {
        return () => {
            debouncedContactSearch.cancel();
        };
    }, [debouncedContactSearch]);

    const renderAutocompleteOption = (props, option) => {
        if (tempLead) {
            return null;
        }
        if (option.isNewContact && isCreateNewAvailable) {
            return (
                <ListItem {...props} onClick={() => handleSelectNewContact(searchQuery)} className={styles.listItem}>
                    <ListItemText
                        primary={
                            <Box display="flex" alignItems="center" sx={{cursor: "pointer"}}>
                                <CreateNewContactIcon/>
                                <Typography variant="subtitle1" style={{marginLeft: 8}}>
                                    Create new contact for <span style={{color: "#0052ce"}}>{searchQuery}</span>
                                </Typography>
                            </Box>
                        }
                    />
                </ListItem>
            );
        }

        if (option.isWarning) {
            return (
                <ListItem {...props} onClick={(e) => e.preventDefault()}>
                    <ListItemText
                        primary={
                            <Typography color="textSecondary" variant="subtitle1">
                                Please enter at least 3 characters to search
                            </Typography>
                        }
                    />
                </ListItem>
            );
        }

        return <ContactListItem {...props} contact={option} handleClick={handleSelectOldContact}/>;
    };

    const handleSubmit = () => {
        if (currentContactOption === "Sms" && !tempLead?.phone) {
            handleClose(false);
            showToast({
                type: "error",
                message: "Cannot send campaign: This contact does not have a phone number.",
                time: 5000,
            });
            return;
        } else if (currentContactOption === "Email" && !tempLead?.email) {
            handleClose(false);
            showToast({
                type: "error",
                message: "Cannot send campaign: This contact does not have an email address.",
                time: 5000,
            });
            return;
        }
        handleContactSelect(tempLead, "old");
        handleClose(false);
    };

    useEffect(() => {
        if (isCreateNewAvailable) {
            setContactList((prevList) => [...prevList, {firstName: "", lastName: "", isNewContact: true}]);
        }
    }, [isCreateNewAvailable]);

    return (
        <CustomModal
            title={title}
            open={open}
            handleClose={handleCancel}
            showCloseButton
            maxWidth="sm"
            disableContentBackground
            footer
            handleSave={handleSubmit}
            shouldShowCancelButton={true}
            isSaveButtonDisabled={!tempLead}
            saveLabel="Continue"
            footerActionIcon={<ContinueIcon/>}
        >
            <Box marginBottom={"20px"}>
                <Typography
                    sx={{
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "#052A63",
                    }}
                >
                    {subTitle}
                </Typography>
            </Box>

            <AutocompleteWrapper>
                <Autocomplete
                    blurOnSelect={true}
                    clearOnBlur={false}
                    openOnFocus={true}
                    options={searchQuery.length >= 3 ? [...contactList] : [{isWarning: true}]}
                    getOptionLabel={(option) => (option.isNewContact ? "" : `${option.firstName} ${option.lastName}`)}
                    filterOptions={(options) => options}
                    renderOption={renderAutocompleteOption}
                    inputValue={searchQuery}
                    onInputChange={handleSearchInputChange}
                    ListboxProps={{
                        style: {
                            maxHeight: 200,
                            overflow: "auto",
                            padding: "20px",
                            marginTop: "4px",
                            display: tempLead ? "none" : "block",
                        },
                    }}
                    renderInput={(params) => (
                        <StyledSearchInput
                            {...params}
                            onKeyDown={onlyAlphabets}
                            type="text"
                            placeholder="Client Name"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? (
                                            <div className={styles.flexAlignCenter}>
                                                <CircularProgress color="inherit" size={20}/>
                                            </div>
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon style={{color: "#0052CE"}}/>
                                    </InputAdornment>
                                ),
                                style: {
                                    height: "48px",
                                    padding: "0 16px",
                                },
                            }}
                        />
                    )}
                />
            </AutocompleteWrapper>
        </CustomModal>
    );
};

AutoCompleteContactSearchModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    handleContactSelect: PropTypes.func.isRequired,
    isCreateNewAvailable: PropTypes.bool,
    handleCancel: PropTypes.func.isRequired,
    searchId: PropTypes.string.isRequired,
    currentContactOption: PropTypes.string.isRequired,
};

export default AutoCompleteContactSearchModal;
