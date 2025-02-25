import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
    CARD_TITLE,
    DISCLAIMER_TEXT,
    HEADER_TITLE,
    CONTINUE_TO_QUOTE,
    SIMPLIFIED_IUL_TITLE,
} from "./HealthConditionContainer.constants";
import styles from "./styles.module.scss";
import { useCreateNewQuote } from "../../providers/CreateNewQuote";
import { ContactProfileTabBar } from "../ContactDetailsContainer";
import Typography from "@mui/material/Typography";
import { Box, Stack } from "@mui/material";
import HealthConditionSearchInput from "./HealthConditionSearchInput";
import SavedPrescriptions from "./SavedPrescriptions";
import HealthConditionsTable from "./HealthConditionsTable";
import HealthConditionSearchByPrescription from "./HealthConditionSearchByPrescription";
import { useHealth } from "providers/ContactDetails";
import { useCallback, useEffect, useState } from "react";
import AddPrescriptionModal from "./AddPrescriptionModal";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import { FullWidthButton } from "@integritymarketing/clients-ui-kit";
import HealthConditionQuestionModal from "./HealthConditionQuestionModal";
import { useConditions } from "providers/Conditions";

const HealthConditionsPageContainer = () => {
    const { contactId } = useParams();
    const navigate = useNavigate();
    const loc = useLocation();
    const { isSimplifiedIUL } = useCreateNewQuote();
    const { fetchHealthConditions } = useConditions();
    const { prescriptions, fetchPrescriptions } = useHealth();
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [openAddPrescriptionModal, setOpenAddPrescriptionModal] = useState(false);
    const [prescriptionDetails, setPrescriptionDetails] = useState(null);
    const [selectedCondition, setSelectedCondition] = useState(null);
    const [openQuestionModal, setOpenQuestionModal] = useState(false);

    useEffect(() => {
        if (contactId) {
            fetchPrescriptionsData();
        }
    }, [contactId]);

    const fetchPrescriptionsData = useCallback(async () => {
        await fetchPrescriptions(contactId);
    }, [contactId, fetchPrescriptions]);

    const handlePrescriptionClick = (prescription) => {
        setSelectedPrescription(prescription);
    };

    const onHandleApplyClickOfAddPrescriptionModal = (value) => {
        setSelectedCondition(value);
        fetchHealthConditions(contactId);
        setOpenAddPrescriptionModal(false);
        setOpenQuestionModal(true);
    };

    const onSuccessOfHealthConditionQuestionModal = () => {
        setOpenQuestionModal(false);
        setSelectedCondition(null);
        fetchHealthConditions(contactId);
    };

    return (
        <>
            <ContactProfileTabBar
                contactId={contactId}
                showTabs={false}
                backButtonLabel={"Back"}
                backButtonRoute={`${isSimplifiedIUL() ? "/simplified-iul" : "/finalexpenses"}/create/${contactId}`}
            />
            <Box className={styles.pageHeading}>
                <Typography variant="h2" color="#052A63">
                    {isSimplifiedIUL() ? SIMPLIFIED_IUL_TITLE : "Final Expense"}
                </Typography>
            </Box>
            <Box className={styles.pageContainerWrapper}>
                <Box className={styles.pageContainer}>
                    <Box>
                        <Box className={styles.headerTitle}>
                            <h4>{HEADER_TITLE}</h4>
                        </Box>
                        <h3 className={styles.conditionsLabel}>{CARD_TITLE}</h3>
                    </Box>

                    <Box className={styles.conditionsContainer}>
                        <Stack direction="column" gap={3}>
                            <HealthConditionSearchByPrescription
                                selectedPrescription={selectedPrescription}
                                setOpenAddPrescriptionModal={setOpenAddPrescriptionModal}
                                setPrescriptionDetails={setPrescriptionDetails}
                            />
                            {prescriptions.length > 0 && (
                                <SavedPrescriptions
                                    prescriptions={prescriptions}
                                    onPrescriptionClick={handlePrescriptionClick}
                                />
                            )}
                        </Stack>
                        <HealthConditionSearchInput contactId={contactId} />
                    </Box>
                    <Box className={styles.conditionsContainer}>
                        <HealthConditionsTable contactId={contactId} />
                        <Typography variant="body2" sx={{ color: "#6B7280", fontStyle: "italic" }}>
                            {DISCLAIMER_TEXT}
                        </Typography>
                    </Box>
                    <FullWidthButton
                        label={CONTINUE_TO_QUOTE}
                        onClick={() =>
                            navigate(`${isSimplifiedIUL() ? "/simplified-iul" : "/finalexpenses"}/plans/${contactId}`, {
                                state: { from: loc?.pathname },
                            })
                        }
                        type="primary"
                        icon={<ButtonCircleArrow />}
                        fullWidth={true}
                        iconPosition="right"
                        style={{ border: "none" }}
                        className={styles.nextButton}
                    />
                </Box>
            </Box>
            {openAddPrescriptionModal ? (
                <AddPrescriptionModal
                    open={openAddPrescriptionModal}
                    onClose={() => setOpenAddPrescriptionModal(false)}
                    prescriptionDetails={prescriptionDetails}
                    contactId={contactId}
                    onHandleApplyClickOfAddPrescriptionModal={onHandleApplyClickOfAddPrescriptionModal}
                />
            ) : null}
            {openQuestionModal ? (
                <HealthConditionQuestionModal
                    open={openQuestionModal}
                    onClose={() => {
                        setOpenQuestionModal(false);
                        setSelectedCondition(null);
                    }}
                    contactId={contactId}
                    onSuccessOfHealthConditionQuestionModal={onSuccessOfHealthConditionQuestionModal}
                    selectedCondition={selectedCondition}
                />
            ) : null}
        </>
    );
};

export default HealthConditionsPageContainer;
