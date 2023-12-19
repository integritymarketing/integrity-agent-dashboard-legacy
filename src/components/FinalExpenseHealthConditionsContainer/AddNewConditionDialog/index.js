import React, { useEffect, useState } from "react";

import { Link } from "@mui/material";
import Box from "@mui/material/Box";

import debounce from "lodash/debounce";
import PropTypes from "prop-types";

import { formatDate, formatServerDate, parseDate } from "utils/dates";

import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";

import DatePickerMUI from "components/DatePicker";
import Modal from "components/Modal";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import RadioChecked from "components/icons/radio-checked";
import RadioUnchecked from "components/icons/radio-unchecked";
import SearchBlue from "components/icons/version-2/SearchBlue";
import Textfield from "components/ui/textfield";

import clientsService from "services/clientsService";

import useContactDetails from "pages/ContactDetails/useContactDetails";

import styles from "./AddNewCondition.module.scss";
import {
    DATE_LAST_TREATMENT,
    DELETE_CONDITION,
    DELETING,
    HEALTH_CONDITION_SEARCH_API,
    HEALTH_CONDITION_TITLE,
    HEALTH_INTAKE_TITLE,
    MODAL_CONDITION_TITLE,
    NEXT,
    NO_RESULTS,
    RESULT_FOUND,
    SAVE,
    SAVING,
    SEARCH_CARD_LABEL,
    SEARCH_CARD_LOADING,
    SEARCH_CONDITION_ALREADY_ADDED,
    SEARCH_TITLE,
} from "./AddNewConditionDialog.constants";

import { HEALTH_CONDITION_API } from "../FinalExpenseHealthConditionsContainer.constants";
import { Close } from "../icons/Close";

const AddNewConditionDialog = ({
    contactId,
    open,
    onClose,
    setHealthConditions,
    selectedConditionForEdit,
    refetchConditionsList,
    healthConditions,
    disableLastTreatmentDate = false,
}) => {
    const [searchString, setSearchString] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [selectedCondition, setSelectedCondition] = useState(selectedConditionForEdit);
    const [lastTreatmentDate, setLastTreatmentDate] = useState(
        selectedConditionForEdit?.lastTreatmentDate ? selectedConditionForEdit?.lastTreatmentDate : null
    );
    const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
    const [isSavingToServer, setIsSavingToServer] = useState(false);
    const [isDeletingFromServer, setIsDeletingFromServer] = useState(false);
    const [modalStep, setModalStep] = useState(
        selectedConditionForEdit?.hasLookBackPeriod === true && !disableLastTreatmentDate
            ? 1
            : selectedConditionForEdit?.hasLookBackPeriod === false ||
              (selectedConditionForEdit && disableLastTreatmentDate)
            ? 2
            : 0
    );
    const { getLeadDetails, leadDetails } = useContactDetails(contactId);
    const showToast = useToast();
    const { Get: getSearchResults } = useFetch(`${HEALTH_CONDITION_SEARCH_API}${searchString}`);
    const { Post: addNewHealthCondition, Put: updateHeathCondition } = useFetch(`${HEALTH_CONDITION_API}${contactId}`);

    const debouncedOnChangeHandle = debounce((value) => {
        setSearchString(value);
    }, 300);

    const onChangeHandle = (e) => {
        const value = e.target.value;
        debouncedOnChangeHandle(value);
    };

    useEffect(() => {
        getLeadDetails();
    }, []);

    useEffect(() => {
        if (searchString.length > 2) {
            async function getData() {
                setIsLoadingSearchResults(true);
                const response = await getSearchResults();
                if (response && response?.uwConditions) {
                    const existingConditionIds = new Set(healthConditions.map((hc) => hc.conditionId.toString()));
                    const filteredResults = response.uwConditions.filter(
                        (condition) => !existingConditionIds.has(condition.conditionId.toString())
                    );
                    setSearchResults(filteredResults);
                } else {
                    setSearchResults(null);
                }
                setIsLoadingSearchResults(false);
            }
            getData();
        }
    }, [searchString]);

    const saveToAPI = async () => {
        if (!selectedCondition) return null;
        setIsSavingToServer(true);

        let lastTreatmentDateServer = null;
        if (lastTreatmentDate) {
            if (lastTreatmentDate.indexOf("/") > 0) {
                lastTreatmentDateServer = formatServerDate(parseDate(lastTreatmentDate));
            } else {
                lastTreatmentDateServer = lastTreatmentDate;
            }
        }
        if (selectedConditionForEdit) {
            const response = await updateHeathCondition({
                ...selectedConditionForEdit,
                lastTreatmentDate: lastTreatmentDateServer,
            });
            if (response && response.length > 0) {
                setHealthConditions([...response]);
            }
        } else {
            const response = await addNewHealthCondition({
                agentNPN: leadDetails.agentNpn,
                leadId: contactId,
                conditionId: selectedCondition.conditionId.toString(),
                conditionName: selectedCondition.conditionName,
                conditionDescription: selectedCondition.conditionDescription,
                stateCode: selectedCondition.StateCode,
                hasLookBackPeriod: selectedCondition.hasLookBackPeriod,
                lastTreatmentDate: lastTreatmentDateServer,
                consumerId: 0,
            });
            if (response && response.length > 0) {
                setHealthConditions([...response]);
            }
        }
        setIsSavingToServer(false);
    };

    const handleOnSave = async () => {
        if (selectedCondition && modalStep === 0) {
            if (disableLastTreatmentDate || !selectedCondition.hasLookBackPeriod) {
                await saveToAPI();
                resetState();
            } else {
                setModalStep(1);
            }
        } else if (selectedCondition) {
            await saveToAPI();
            resetState();
        }
    };

    const resetState = () => {
        onClose();
        setModalStep(0);
        setSearchString("");
        setIsSavingToServer(false);
        setSelectedCondition(null);
        setIsLoadingSearchResults(false);
        setIsDeletingFromServer(false);
    };

    const handleDelete = async () => {
        if (!selectedConditionForEdit?.id) {
            resetState();
            return;
        }
        setIsDeletingFromServer(true);
        const response = await clientsService.deleteHealthCondition(contactId, selectedConditionForEdit?.id);
        if (response && response.status === 200) {
            showToast({
                type: "success",
                message: "Health condition deleted successfully",
                time: 3000,
            });
        }
        refetchConditionsList();
        setIsDeletingFromServer(false);
        resetState();
    };
    const handleOnClose = async () => {
        if (modalStep === 1 && selectedCondition?.hasLookBackPeriod) {
            await saveToAPI();
        }
        resetState();
    };

    const renderContent = () => {
        return (
            <div>
                <div className={styles.subHeading}>
                    <div className={styles.subHeadingTitle}>{SEARCH_TITLE}</div>
                </div>
                <div>
                    <Textfield
                        type="search"
                        name="search"
                        defaultValue={searchString}
                        icon={<SearchBlue />}
                        placeholder="Search"
                        className={styles.searchInput}
                        onChange={onChangeHandle}
                    />
                    {searchResults === null && !isLoadingSearchResults && (
                        <Box className={styles.searchResultInitialBox}>
                            <div className={styles.searchResultTitle}>{SEARCH_CARD_LABEL}</div>
                        </Box>
                    )}
                    {isLoadingSearchResults && (
                        <Box className={styles.searchResultInitialBox}>
                            <div className={styles.searchResultTitle}>{SEARCH_CARD_LOADING}</div>
                        </Box>
                    )}
                    {!isLoadingSearchResults &&
                        searchResults &&
                        searchResults.length === 0 &&
                        !Array.isArray(searchResults) && (
                            <Box className={styles.searchResultInitialBox}>
                                <div className={styles.searchResultTitle}>{NO_RESULTS}</div>
                            </Box>
                        )}
                    {!isLoadingSearchResults &&
                        searchResults &&
                        searchResults.length === 0 &&
                        Array.isArray(searchResults) && (
                            <Box className={styles.searchResultInitialBox}>
                                <div className={styles.searchResultTitle}>{SEARCH_CONDITION_ALREADY_ADDED}</div>
                            </Box>
                        )}
                    {searchResults && !isLoadingSearchResults && searchResults.length > 0 && (
                        <Box className={styles.searchResultBox}>
                            <div className={styles.searchResultTitle}>
                                {searchResults.length} {RESULT_FOUND}
                            </div>
                            <div className={styles.searchResultList}>
                                {searchResults.map((result) => {
                                    const checked = selectedCondition?.conditionId === result.conditionId;
                                    return (
                                        <div
                                            className={`${styles.searchResultItem} ${
                                                selectedCondition?.conditionId === result.conditionId
                                                    ? styles.selected
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setSelectedCondition(result);
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                className={styles.radioInput}
                                                name={"condition"}
                                                value={result.conditionId}
                                                checked={checked}
                                            />
                                            {checked ? <RadioChecked /> : <RadioUnchecked />}
                                            <span>{result.conditionName}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </Box>
                    )}
                </div>
            </div>
        );
    };

    const renderLookBackPeriodContent = () => {
        return (
            <div>
                <div className={styles.subHeading}>
                    <div className={styles.subHeadingTitle}>{selectedCondition.conditionName}</div>
                </div>
                <div className={styles.lastDateInputContainer}>
                    <div className={styles.lastDateInputTitle}>{DATE_LAST_TREATMENT}</div>
                    <div className={styles.lastDateInputBox}>
                        <DatePickerMUI
                            value={lastTreatmentDate}
                            disableFuture={true}
                            onChange={(value) => setLastTreatmentDate(formatDate(value))}
                            className={styles.datepicker}
                        />
                    </div>
                </div>
                <div className={styles.conditionDialogDeleteBox}>
                    <Link
                        className={`${styles.conditionDialogDeleteText} ${
                            isDeletingFromServer ? styles.conditionDialogDeleteTextDisabled : ""
                        }`}
                        onClick={handleDelete}
                    >
                        {isDeletingFromServer ? DELETING : DELETE_CONDITION}
                    </Link>
                </div>
            </div>
        );
    };

    const renderConditionNameContent = () => {
        return (
            <div>
                <div className={styles.conditionNameContentBox}>
                    <div className={styles.conditionNameContentName}>{selectedCondition.conditionName}</div>
                </div>
                <div className={styles.conditionDialogDeleteBox}>
                    <Link
                        className={`${styles.conditionDialogDeleteText} ${
                            isDeletingFromServer ? styles.conditionDialogDeleteTextDisabled : ""
                        }`}
                        onClick={handleDelete}
                    >
                        {isDeletingFromServer ? DELETING : DELETE_CONDITION}
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <Box>
            <Modal
                maxWidth="sm"
                actionButtonDisabled={
                    selectedCondition === null ||
                    isSavingToServer ||
                    isDeletingFromServer ||
                    (modalStep === 1 && !lastTreatmentDate)
                }
                open={open}
                dialogContentClassName={styles.dialogContent}
                onClose={handleOnClose}
                onCancel={handleOnClose}
                hideFooter={modalStep === 2}
                title={
                    <div className={styles.subHeading}>
                        {modalStep === 0
                            ? MODAL_CONDITION_TITLE
                            : modalStep === 2
                            ? HEALTH_CONDITION_TITLE
                            : HEALTH_INTAKE_TITLE}
                    </div>
                }
                onSave={() => {
                    handleOnSave();
                }}
                actionButtonName={isSavingToServer ? SAVING : modalStep === 0 ? NEXT : SAVE}
                closeIcon={<Close />}
                actionButtonClassName={styles.saveButton}
                cancelClassName={styles.cancelButton}
                endIcon={<ButtonCircleArrow />}
            >
                <Box className={styles.connectModalBody}>
                    {modalStep === 0
                        ? renderContent()
                        : modalStep === 2
                        ? renderConditionNameContent()
                        : renderLookBackPeriodContent()}
                </Box>
            </Modal>
        </Box>
    );
};

AddNewConditionDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    contactId: PropTypes.string.isRequired,
    setHealthConditions: PropTypes.func.isRequired,
    selectedConditionForEdit: PropTypes.object,
    refetchConditionsList: PropTypes.func.isRequired,
};

export default React.memo(AddNewConditionDialog);
