import { useState, useEffect, useMemo } from "react";
import { useHealth } from "providers/ContactDetails/ContactDetailsContext";
import ArrowForwardWithCircle from "../Icons/ArrowForwardWithCircle";
import AddCircleOutline from "../Icons/AddCircleOutline";
import Typography from "@mui/material/Typography";
import ErrorState from "../SharedComponents/ErrorState";
import Modal from "components/Modal";
import PropTypes from "prop-types";
import SearchInput from "../SharedComponents/SearchInput";
import SearchLabel from "../SharedComponents/SearchLabel";
import PrescriptionList from "./PrescriptionList";
import PrescriptionForm from "./PrescriptionForm";
import { useClientServiceContext } from "services/clientServiceProvider";

import "./styles.module.scss";

const transformPrescriptionOptions = (option) => {
    const { drugName, drugType, drugID, referenceNDC, genericDrugID, genericDrugType, genericDrugName } = option;
    return {
        label: drugName,
        drugName,
        description: drugType,
        value: drugID,
        ndc: referenceNDC,
        g_value: genericDrugID,
        g_description: genericDrugType ? genericDrugType : "Generic",
        g_label: genericDrugName,
    };
};

const frontTruncate = (str, maxChars, replacement = "...") => {
    if (str.length > maxChars) {
        const value = str.slice(0, 14) + replacement + str.slice(str.length - 13, str.length);
        return value;
    }
    return str;
};

const PrescriptionModal = ({ onClose: onCloseHandler, open, item, isEdit, refresh, leadId }) => {
    const { addPrescription, editPrescription, deletePrescription } = useHealth();
    const { labelName, daysOfSupply, userQuantity, ndc } = item?.dosage ?? {};
    const { clientsService } = useClientServiceContext();

    const [searchselected, onSearchSelected] = useState("");
    const [selectedDrug, onDrugSelection] = useState("");
    const [searchString, setSearchString] = useState("");
    const [prescriptionList, setprescriptionList] = useState([]);
    const [dosageOptions, setDosageOptions] = useState([]);
    const [dosage, setDosage] = useState();
    const [quantity, setQuantity] = useState(userQuantity);
    const [frequency, setFrequency] = useState(daysOfSupply);
    const [packageOptions, setPackageOptions] = useState([]);
    const [dosagePackage, setDosagePackage] = useState();
    const [isLoading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedGenericDrug, setSelectedGenericDrug] = useState(false);
    const [initialValues, setInitialValues] = useState({});

    useEffect(() => {
        const getDosages = async () => {
            setDosagePackage("");
            setPackageOptions([]);
            setLoading(true);
            try {
                const drugID = selectedGenericDrug ? selectedDrug?.g_value : selectedDrug?.value;
                const results = await clientsService.getDrugDetails(drugID);
                const dosageOptions = (results?.dosages || []).map((dosage) => ({
                    label: dosage.labelName,
                    value: dosage,
                }));
                setDosageOptions(dosageOptions);
                if (dosageOptions.length === 1 && !isEdit) {
                    setDosage(dosageOptions[0].value);
                } else if (isEdit) {
                    const dosageInfo = dosageOptions
                        .filter((dosageOption) => dosageOption?.value?.labelName === labelName)
                        .map((opt) => opt.value)[0];
                    setDosage(dosageInfo);
                    setInitialValues((data) => ({ ...data, dosage: dosageInfo }));
                } else {
                    setDosage("");
                }
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 100);
            }
        };
        selectedDrug && getDosages();
    }, [selectedDrug, selectedGenericDrug, isEdit, labelName]);

    useEffect(() => {
        if (item && open && isEdit) {
            const { dosage } = item;
            const { drugName, drugType, drugID, referenceNDC, genericDrugID, genericDrugType, chemicalName } = dosage;

            const selectedDrug = {
                label: drugName,
                drugName,
                description: drugType,
                value: drugID,
                ndc: referenceNDC,
                g_value: genericDrugID,
                g_description: genericDrugType ? genericDrugType : "Generic",
                g_label: chemicalName,
            };
            onDrugSelection(selectedDrug);
        }
    }, [item, open, isEdit]);

    useEffect(() => {
        if (dosage) {
            const { commonUserQuantity, commonDaysOfSupply } = dosage;
            const packageOptions = (dosage?.packages || []).map((_package) => ({
                label: _package.packageDisplayText,
                value: _package,
            }));

            setPackageOptions(packageOptions);

            if (isEdit) {
                const selectedPackage = packageOptions
                    .filter((packageOption) => packageOption?.value?.referenceNDC === ndc)
                    .map((opt) => opt.value)[0];
                setDosagePackage(selectedPackage);

                setInitialValues((data) => ({
                    ...data,
                    dosagePackage: selectedPackage,
                    quantity: userQuantity,
                    frequency: daysOfSupply,
                }));
            } else if (packageOptions.length === 1) {
                setDosagePackage(packageOptions[0].value);
                setQuantity(commonUserQuantity);
                setFrequency(commonDaysOfSupply);
            } else {
                setDosagePackage(null);
                setQuantity(commonUserQuantity);
                setFrequency(commonDaysOfSupply);
            }
        }
    }, [dosage, isEdit, ndc, daysOfSupply, userQuantity]);

    const fetchOptions = async (event) => {
        const searchStr = event.target.value;
        onDrugSelection(null);
        setSelectedGenericDrug(false);
        setSearchString(searchStr);
        if (searchStr && searchStr.length > 1) {
            const prescriptionList = await clientsService.getDrugNames(searchStr);
            const options = (prescriptionList || []).map(transformPrescriptionOptions);
            setprescriptionList(options);
        } else {
            setprescriptionList([]);
        }
    };

    // Event Handlers

    const handleQuantity = (e) => setQuantity(e.currentTarget.value);

    const handleAddPrescription = async () => {
        setIsSaving(true);
        try {
            await addPrescription(
                {
                    dosageRecordID: 0,
                    dosageID: dosage?.dosageID,
                    quantity: quantity,
                    daysOfSupply: frequency,
                    ndc: dosagePackage ? dosagePackage?.referenceNDC : dosage?.referenceNDC,
                    metricQuantity: quantity * (dosagePackage?.commonMetricQuantity ?? 1),
                    selectedPackage: null,
                },
                refresh,
                leadId,
            );
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePrescription = async () => {
        setIsSaving(true);
        try {
            await editPrescription(
                {
                    dosageRecordID: item?.dosage?.dosageRecordID,
                    labelName: dosage?.labelName,
                    dosage,
                    ndc: dosagePackage ? dosagePackage?.referenceNDC : dosage?.referenceNDC,
                    daysOfSupply: frequency,
                    selectedPackage: null,
                    metricQuantity: quantity * (dosagePackage?.commonMetricQuantity ?? 1),
                    quantity: quantity,
                },
                refresh,
                leadId,
            );
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeletePrescription = () => {
        onClose();
        deletePrescription(item, refresh, leadId);
    };

    const isFormValid = useMemo(() => {
        return Boolean(
            selectedDrug && quantity && frequency && dosage && (packageOptions.length > 0 ? dosagePackage : true),
        );
    }, [selectedDrug, quantity, frequency, dosage, dosagePackage, packageOptions]);

    const isUpdated = () => {
        return (
            initialValues.quantity !== parseInt(quantity) ||
            initialValues.frequency !== frequency ||
            initialValues.dosagePackage !== dosagePackage ||
            initialValues.dosage !== dosage
        );
    };

    const validUpdate = isUpdated();

    const onClose = (ev) => {
        setprescriptionList([]);
        onDrugSelection("");
        setSearchString("");
        setDosage();
        setQuantity();
        setFrequency();
        setDosageOptions([]);
        setPackageOptions([]);
        setDosagePackage();
        onCloseHandler(ev);
    };

    const onAddSearchSelectedDrug = () => {
        onDrugSelection(searchselected);
    };

    const ERROR_STATE = searchString?.length === 0 || prescriptionList?.length === 0;

    const addFunction = isFormValid ? handleAddPrescription : onAddSearchSelectedDrug;

    const disabled = isEdit
        ? !validUpdate || !isFormValid || isSaving
        : selectedDrug
          ? !isFormValid || isSaving
          : !searchselected
            ? true
            : false;

    return (
        <Modal
            open={open}
            title={isEdit ? "Update Prescription" : "Add Prescriptions"}
            onClose={onClose}
            onCancel={isEdit ? handleDeletePrescription : onClose}
            cancelButtonName={isEdit ? "Delete Prescription" : "Cancel"}
            onSave={isEdit ? handleUpdatePrescription : addFunction}
            actionButtonName={isEdit ? "Update Prescription" : "Add Prescription"}
            actionButtonDisabled={disabled}
            endIcon={selectedDrug ? <AddCircleOutline /> : <ArrowForwardWithCircle />}
            modalName="Prescription"
        >
            {!selectedDrug && !isLoading ? (
                <>
                    <SearchLabel label={"Search for a Prescription"} />
                    <SearchInput
                        searchString={searchString}
                        total={prescriptionList?.length > 0 ? prescriptionList?.length : 0}
                        handleSearch={fetchOptions}
                        label={"Prescriptions"}
                    />

                    {ERROR_STATE ? (
                        <ErrorState searchString={searchString} list={prescriptionList} title={"Prescription"} />
                    ) : (
                        <PrescriptionList
                            prescriptionList={prescriptionList}
                            onDrugSelection={onSearchSelected}
                            selected={searchselected}
                            multiple={true}
                        />
                    )}
                </>
            ) : (
                <>
                    <PrescriptionList
                        prescriptionList={[{ ...selectedDrug }]}
                        onDrugSelection={() => setSelectedGenericDrug(false)}
                        selected={!selectedGenericDrug}
                    />

                    {selectedDrug.g_value && selectedDrug?.description === "Brand" ? (
                        <>
                            <Typography
                                style={{
                                    color: "#052A63",
                                    fontSize: 20,
                                    fontFamily: "Lato",
                                    letterSpacing: "0.2px",
                                    marginTop: 10,
                                }}
                            >
                                Would you like to use the Generic Version?
                            </Typography>
                            <Typography
                                style={{
                                    color: "#434A51",
                                    fontSize: 16,
                                    fontFamily: "Lato",
                                    letterSpacing: "0.16px",
                                    marginTop: 10,
                                }}
                            >
                                According to the FDA, this generic drug has the same quality, strength, safety and
                                active ingredient as the brand name drug.
                            </Typography>

                            <PrescriptionList
                                prescriptionList={[
                                    {
                                        ...selectedDrug,
                                        description: selectedDrug.g_description,
                                        label: selectedDrug.g_label,
                                    },
                                ]}
                                onDrugSelection={() => setSelectedGenericDrug(true)}
                                selected={selectedGenericDrug}
                            />
                        </>
                    ) : (
                        <></>
                    )}
                    <PrescriptionForm
                        {...{
                            dosage,
                            quantity,
                            frequency,
                            dosageOptions,
                            handleQuantity,
                            setFrequency,
                            setDosage,
                            setDosagePackage,
                            dosagePackage,
                            packageOptions,
                        }}
                    />
                </>
            )}
        </Modal>
    );
};

PrescriptionModal.propTypes = {
    onSave: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    item: PropTypes.object,
    isEdit: PropTypes.bool,
};

PrescriptionModal.defaultProps = {
    onSave: () => {},
    onClose: () => {},
    open: false,
    item: {},
    isEdit: false,
};

export default PrescriptionModal;
