import { useCallback, useEffect, useState } from "react";

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

import { CustomModal } from "components/MuiComponents";

import { styled } from "@mui/system";

import { debounce } from "lodash";
import useToast from "hooks/useToast";
import { useClientServiceContext } from "services/clientServiceProvider";
import { useCreateNewQuote } from "providers/CreateNewQuote";
import ContactListItem from "./ContactListItem";

// Styled component for the search input field
const StyledSearchInput = styled(TextField)(() => ({
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    borderRadius: "4px",
    "& input::placeholder": {
        color: "#434A51",
        fontSize: "16px",
    },
}));

// Styled container for the autocomplete component
const AutocompleteWrapper = styled("div")({
    position: "relative",
    width: "100%",
});

// Main component for the autocomplete contact search
const AutoCompleteContactSearchModal = () => {
    const {
        contactSearchModalOpen: open,
        setContactSearchModalOpen: handleClose,
        handleSelectedLead,
    } = useCreateNewQuote();

    const [searchQuery, setSearchQuery] = useState("");
    const [contactList, setContactList] = useState([]);
    const [loading, setLoading] = useState(false);

    const { clientsService } = useClientServiceContext();
    const showToast = useToast();

    const handleSearchInputChange = (event, value) => {
        setSearchQuery(value);
        if (value.length >= 3) {
            debouncedContactSearch(value);
        } else {
            setContactList([]);
        }
    };

    const handleSelectedContact = (contact, type) => {
        handleSelectedLead(contact, type);
        handleClose(false);
    };

    const onClose = () => {
        handleClose(false);
    };

    const fetchContacts = useCallback(
        async (query) => {
            setLoading(true);
            try {
                const response = await clientsService.getList(
                    undefined,
                    undefined,
                    ["Activities.CreateDate:desc"],
                    query
                );
                if (response && response.result) {
                    setContactList(response.result);
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
        [clientsService, showToast]
    );

    const debouncedContactSearch = useCallback(
        debounce((query) => {
            if (query.length >= 3) {
                fetchContacts(query);
            }
        }, 300),
        [fetchContacts]
    );

    useEffect(() => {
        return () => {
            debouncedContactSearch.cancel();
        };
    }, [debouncedContactSearch]);

    const renderAutocompleteOption = (props, option) => {
        if (option.isNewContact) {
            return (
                <ListItem {...props} onClick={() => handleSelectedContact(searchQuery, "new")}>
                    {!loading && (
                        <ListItemText
                            primary={
                                <Typography color={"#0052ce"} variant="subtitle1">
                                    Create new contact for &quot;{searchQuery}&quot;
                                </Typography>
                            }
                        />
                    )}
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

        return <ContactListItem {...props} contact={option} handleClick={handleSelectedContact} />;
    };

    return (
        <CustomModal
            title={"Start a Quote"}
            open={open}
            handleClose={onClose}
            showCloseButton
            maxWidth="sm"
            disableContentBackground
        >
            <Box marginBottom={"20px"}>
                <Typography
                    sx={{
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "#052A63",
                    }}
                >
                    Enter your client’s name to get started
                </Typography>
            </Box>

            <AutocompleteWrapper>
                <Autocomplete
                    options={
                        searchQuery.length >= 3
                            ? [...contactList, { firstName: "", lastName: "", isNewContact: true }]
                            : [{ isWarning: true }]
                    }
                    getOptionLabel={(option) => (option.isNewContact ? "" : `${option.firstName} ${option.lastName}`)}
                    filterOptions={(options) => options}
                    renderOption={renderAutocompleteOption}
                    inputValue={searchQuery}
                    onInputChange={handleSearchInputChange}
                    ListboxProps={{ style: { maxHeight: 200, overflow: "auto" } }}
                    renderInput={(params) => (
                        <StyledSearchInput
                            {...params}
                            placeholder="Start by typing a contact’s name"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon style={{ color: "#0052CE" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
            </AutocompleteWrapper>
        </CustomModal>
    );
};

export default AutoCompleteContactSearchModal;
