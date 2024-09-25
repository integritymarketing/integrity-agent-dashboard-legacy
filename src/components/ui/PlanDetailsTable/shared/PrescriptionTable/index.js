import React, { useState, useCallback, useEffect } from "react";
import { useHealth } from "providers/ContactDetails/ContactDetailsContext";
import PropTypes from "prop-types";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import Header from "./components/Header";
import Row from "./components/Row";
import Footer from "./components/Footer";
import PrescriptionModal from "components/SharedModals/PrescriptionModal";
import PrescriptionCoverageModal from "components/SharedModals/PrescriptionCoverageModal";
import Plus from "components/icons/plus";
import Edit from "components/Edit";
import EditIcon from "components/icons/edit2";
import { usePharmacyContext } from "providers/PharmacyProvider";

const PrescriptionTable = ({ isMobile, planDrugCoverage, planData, refresh, isEnroll, leadId }) => {
    const { prescriptions, fetchPrescriptions } = useHealth();

    const { selectedPharmacy } = usePharmacyContext();
    const { pharmacyCosts } = planData;

    let drugCosts;

    if (Object.keys(selectedPharmacy).length) {
        drugCosts = pharmacyCosts.find((rx) => rx.pharmacyID === selectedPharmacy.pharmacyId)?.drugCosts;
    } else {
        drugCosts = pharmacyCosts.find((rx) => rx.pharmacyType === 2)?.drugCosts;
    }

    useEffect(() => {
        if (leadId) {
            fetchHealthDetails();
        }
    }, [leadId]);

    const fetchHealthDetails = useCallback(async () => {
        await fetchPrescriptions(leadId);
    }, [leadId, fetchPrescriptions]);

    const [isOpenPrescription, setIsOpenPrescription] = useState(false);
    const [isOpenEditPrescription, setIsOpenEditPrescription] = useState(false);
    const [prescriptionToEdit, setPrescriptionToEdit] = useState([]);
    const [coverageModal, setCoverageModal] = useState(false);

    const onAddNewPrescription = () => setIsOpenPrescription(true);
    const onCloseNewPrescription = () => setIsOpenPrescription(false);
    const onEditPrescription = (item) => {
        setCoverageModal(false);
        setIsOpenEditPrescription(true);
        setPrescriptionToEdit(item);
    };
    const onCloseEditPrescription = () => setIsOpenEditPrescription(false);

    const data = (planDrugCoverage || []).map((planDrug, i) => ({
        ...planDrug,
        ...(drugCosts || [])[i],
    }));

    const coveredDrugs = data.filter((item) => item.tierNumber > 0);
    const nonCoveredDrugs = data.filter((item) => item.tierNumber === 0);

    const hasData = data?.length > 0;
    const isEdit = prescriptions?.length > 0 ? true : false;

    const handleAddEdit = () => {
        if (isEdit) {
            setCoverageModal(true);
        } else {
            onAddNewPrescription();
        }
    };

    const closeAllModalsAndRefresh = () => {
        onCloseNewPrescription(false);
        onCloseEditPrescription(false);
        setCoverageModal(false);
        refresh();
    };

    return (
        <PlanDetailsContactSectionCard
            title="Prescriptions"
            isDashboard={true}
            preferencesKey={"prescriptions_collapse"}
            actions={
                !isEnroll ? (
                    <Edit
                        label={isEdit ? "Edit" : "Add"}
                        onClick={handleAddEdit}
                        icon={isEdit ? <EditIcon /> : <Plus />}
                    />
                ) : null
            }
        >
            {coveredDrugs?.length > 0 && (
                <>
                    <Header isMobile={isMobile} isCovered />
                    <Row
                        isMobile={isMobile}
                        drugDetails={coveredDrugs}
                        isCovered
                        prescriptions={prescriptions}
                        onEditPrescription={onEditPrescription}
                    />
                </>
            )}

            {nonCoveredDrugs?.length > 0 && (
                <div>
                    <Header isMobile={isMobile} />
                    <Row isMobile={isMobile} drugDetails={nonCoveredDrugs} prescriptions={prescriptions} />
                </div>
            )}
            {hasData && (
                <Footer
                    isMobile={isMobile}
                    planData={planData}
                    count={coveredDrugs?.length + nonCoveredDrugs?.length}
                />
            )}
            {isOpenPrescription && (
                <PrescriptionModal
                    open={isOpenPrescription}
                    onClose={() => onCloseNewPrescription(false)}
                    prescriptions={prescriptions}
                    refresh={closeAllModalsAndRefresh}
                    leadId={leadId}
                />
            )}

            {isOpenEditPrescription && (
                <PrescriptionModal
                    open={isOpenEditPrescription}
                    onClose={() => onCloseEditPrescription(false)}
                    item={prescriptionToEdit}
                    isEdit={true}
                    refresh={closeAllModalsAndRefresh}
                    leadId={leadId}
                />
            )}

            {coverageModal && (
                <PrescriptionCoverageModal
                    open={coverageModal}
                    onClose={() => setCoverageModal(false)}
                    prescriptions={prescriptions}
                    planName={planData?.planName}
                    refresh={closeAllModalsAndRefresh}
                    coveredDrugs={coveredDrugs}
                    addNew={() => {
                        setCoverageModal(false);
                        onAddNewPrescription();
                    }}
                    onEditPrescription={onEditPrescription}
                />
            )}
        </PlanDetailsContactSectionCard>
    );
};

PrescriptionTable.propTypes = {
    prescriptions: PropTypes.array,
    isMobile: PropTypes.bool,
    planDrugCoverage: PropTypes.array,
    planData: PropTypes.object,
    refresh: PropTypes.func,
    isEnroll: PropTypes.bool,
    leadId: PropTypes.string,
};

export default PrescriptionTable;
