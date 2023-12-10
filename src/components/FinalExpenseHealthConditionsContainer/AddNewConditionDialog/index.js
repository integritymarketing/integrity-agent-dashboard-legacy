import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarMonth } from "@mui/icons-material";
import { Link } from "@mui/material";
import Box from "@mui/material/Box";
import debounce from "lodash/debounce";
import PropTypes from "prop-types";
import useFetch from "hooks/useFetch";
import Modal from "components/Modal";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import SearchBlue from "components/icons/version-2/SearchBlue";
import Radio from "components/ui/Radio";
import Textfield from "components/ui/textfield";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import styles from "./AddNewCondition.module.scss";
import {
    DATE_LAST_TREATMENT,
    DATE_PLACEHOLDER,
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
    SEARCH_TITLE,
} from "./AddNewConditionDialog.constants";

import { HEALTH_CONDITION_API } from "../FinalExpenseHealthConditionsContainer.constants";

const AddNewConditionDialog = ({
    open,
    onClose,
    setHealthConditions,
    selectedConditionForEdit,
    refetchConditionsList,
}) => {
    const [searchString, setSearchString] = useState("");
    const { contactId } = useParams();
    const [searchResults, setSearchResults] = useState(null);
    const [selectedCondition, setSelectedCondition] = useState(selectedConditionForEdit);
    const [lastTreatmentDate, setLastTreatmentDate] = useState(
        selectedConditionForEdit?.lastTreatmentDate ? selectedConditionForEdit?.lastTreatmentDate : null
    );
    const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
    const [isSavingToServer, setIsSavingToServer] = useState(false);
    const [isDeletingFromServer, setIsDeletingFromServer] = useState(false);
    const [modalStep, setModalStep] = useState(
        selectedConditionForEdit?.hasLookBackPeriod === true
            ? 1
            : selectedConditionForEdit?.hasLookBackPeriod === false
            ? 2
            : 0
    );
    const { getLeadDetails, leadDetails } = useContactDetails(contactId);

    const { Get: getSearchResults } = useFetch(`${HEALTH_CONDITION_SEARCH_API}${searchString}`);
    const { Post: addNewHealthCondition, Put: updateHeathCondition } = useFetch(`${HEALTH_CONDITION_API}${contactId}`);
    const { Delete: deleteHealthCondition } = useFetch(
        `${HEALTH_CONDITION_API}${contactId}/id/${selectedConditionForEdit?.id}`
    );

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
                const resp = await getSearchResults();
                if (resp && resp.uwConditions) {
                    setSearchResults([...resp.uwConditions]);
                } else {
                    setSearchResults([]);
                }

                setIsLoadingSearchResults(false);
            }
            getData();
        }
    }, [searchString]);

    const saveToAPI = async () => {
        if (!selectedCondition) return null;
        setIsSavingToServer(true);
        if (selectedConditionForEdit) {
            const response = await updateHeathCondition({
                ...selectedConditionForEdit,
                lastTreatmentDate,
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
                lastTreatmentDate,
                consumerId: 0,
            });
            if (response && response.length > 0) {
                setHealthConditions([...response]);
            }
        }
        setIsSavingToServer(false);
    };

    const handleOnSave = () => {
        if (selectedCondition && modalStep === 0) {
            if (selectedCondition.hasLookBackPeriod) {
                setModalStep(1);
            } else {
                setModalStep(2);
            }
        } else if (modalStep === 1) {
            handleOnClose();
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
        await deleteHealthCondition();
        refetchConditionsList();
        setIsDeletingFromServer(false);
        resetState();
    };

    const handleOnClose = async () => {
        await saveToAPI();
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
                    {!isLoadingSearchResults && searchResults && searchResults.length === 0 && (
                        <Box className={styles.searchResultInitialBox}>
                            <div className={styles.searchResultTitle}>{NO_RESULTS}</div>
                        </Box>
                    )}
                    {searchResults && !isLoadingSearchResults && searchResults.length > 0 && (
                        <Box className={styles.searchResultBox}>
                            <div className={styles.searchResultTitle}>
                                {searchResults.length} {RESULT_FOUND}
                            </div>
                            <div className={styles.searchResultList}>
                                {searchResults.map((result) => {
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
                                            <Radio
                                                checked={selectedCondition?.conditionId === result.conditionId}
                                                label={result.conditionName}
                                            />
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
                        <Textfield
                            type="date"
                            name="lastTreatmentDate"
                            icon={<CalendarMonth className={styles.calendarIcon} />}
                            value={lastTreatmentDate ? new Date(lastTreatmentDate) : null}
                            placeholder={DATE_PLACEHOLDER}
                            onDateChange={(e) => {
                                setLastTreatmentDate(e.toISOString());
                            }}
                            className={styles.lastDateInput}
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
                actionButtonClassName={styles.saveButton}
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
    setHealthConditions: PropTypes.func.isRequired,
    selectedConditionForEdit: PropTypes.object,
    refetchConditionsList: PropTypes.func.isRequired,
};

export default React.memo(AddNewConditionDialog);
