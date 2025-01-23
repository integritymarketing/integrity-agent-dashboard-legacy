import React, { useState, useEffect, useMemo } from "react";
import Media from "react-media";
import { Select } from "components/ui/Select";
import Modal from "components/ui/modal";
import { Button } from "components/ui/Button";
import Textfield from "components/ui/textfield";
import FREQUENCY_OPTIONS from "utils/frequencyOptions";
import analyticsService from "services/analyticsService";
import { useClientServiceContext } from "services/clientServiceProvider";
import "./modals.scss";

export default function EditPrescription({ isOpen, onClose: onCloseHandler, item, onSave }) {
    const { drugName, drugType, labelName, daysOfSupply, userQuantity, selectedPackageID } = item?.dosage ?? {};
    const [dosage, setDosage] = useState();
    const [dosageOptions, setDosageOptions] = useState([]);
    const [quantity, setQuantity] = useState(userQuantity);
    const [frequency, setFrequency] = useState(daysOfSupply);
    const [packageOptions, setPackageOptions] = useState([]);
    const [dosagePackage, setDosagePackage] = useState();
    const [isMobile, setIsMobile] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { clientsService } = useClientServiceContext();

    useEffect(() => {
        if (isOpen) {
            analyticsService.fireEvent("event-modal-appear", {
                modalName: "Edit Prescription",
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setQuantity((q) => q || userQuantity);
            setFrequency((f) => f || daysOfSupply);
        }
    }, [userQuantity, daysOfSupply, isOpen]);

    useEffect(() => {
        if (item && isOpen) {
            const packageOptions = (item?.dosageDetails?.packages || []).map((_package) => ({
                label: _package.packageDisplayText,
                value: _package,
            }));
            setPackageOptions(packageOptions);
            const selectedPackage = packageOptions
                .filter((packageOption) => packageOption?.value?.referenceNDC === item?.dosage?.ndc)
                .map((opt) => opt.value)[0];
            setDosagePackage(selectedPackage);
        }
    }, [item, isOpen, selectedPackageID]);

    useEffect(() => {
        if (dosage && isOpen) {
            const packageOptions = (dosage?.packages || []).map((_package) => ({
                label: _package.packageDisplayText,
                value: _package,
            }));

            setPackageOptions(packageOptions);

            const selectedPackage = packageOptions
                .filter((packageOption) => packageOption?.value?.referenceNDC === item?.dosage?.ndc)
                .map((opt) => opt.value)[0];
            if (packageOptions.length === 1) {
                setDosagePackage(packageOptions[0].value);
            } else {
                setDosagePackage(selectedPackage);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dosage, isOpen]);

    const onClose = (ev) => {
        setDosage();
        setQuantity();
        setDosageOptions();
        setPackageOptions();
        setDosagePackage();
        setFrequency();
        onCloseHandler(ev);
    };
    const handleQuantity = (e) => setQuantity(e.currentTarget.value);
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                dosageRecordID: item?.dosage?.dosageRecordID,
                labelName: dosage?.labelName,
                dosage,
                ndc: dosagePackage ? dosagePackage?.referenceNDC : dosage?.referenceNDC,
                daysOfSupply: frequency,
                selectedPackage: null,
                metricQuantity: quantity * (dosagePackage?.commonMetricQuantity ?? 1),
                quantity: quantity,
            });
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const getDosages = async () => {
            const results = await clientsService.getDrugDetails(item?.dosage?.drugID);
            const dosageOptions = (results?.dosages || []).map((dosage) => ({
                label: dosage.labelName,
                value: dosage,
            }));
            setDosageOptions(dosageOptions);
            setDosage(
                dosageOptions
                    .filter((dosageOption) => dosageOption?.value?.labelName === labelName)
                    .map((opt) => opt.value)[0]
            );
        };
        drugName && isOpen && getDosages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drugName, isOpen]);

    const isFormValid = useMemo(() => {
        return Boolean(
            drugName && quantity && frequency && dosage && (packageOptions.length > 0 ? dosagePackage : true)
        );
    }, [drugName, quantity, frequency, dosage, dosagePackage, packageOptions]);

    return (
        <div className="prescription--modal">
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <Modal
                size="lg"
                wide={true}
                open={isOpen}
                onClose={onClose}
                providerModal={isMobile}
                labeledById="dialog_edit_prescription"
            >
                <div className="dialog--container">
                    <div className="dialog--title">
                        <h2 id="dialog_help_label" className="add--prescription--modal hdg hdg--2 mb-1">
                            Edit Prescription
                        </h2>
                    </div>
                    <div className="dialog--body">
                        <section className="mt-2 mb-2 display--drug--name">
                            <div className="pt-2 pl-2 drug--name">{drugName}</div>
                            <div className="pl-2 drug--type">{drugType}</div>
                        </section>
                        <div className="prescription__wrapper">
                            <div className="form-element prescription--dosage">
                                <label className="label--dosage form-input__header" htmlFor="prescription-dosage">
                                    Dosage
                                </label>
                                <Select
                                    providerModal={true}
                                    id="prescription-dosage"
                                    initialValue={dosage}
                                    options={dosageOptions}
                                    placeholder="Dosage"
                                    onChange={setDosage}
                                />
                            </div>
                            <div className="quantity-frequency-wrapper">
                                <div className="form-element prescription--quantity">
                                    <Textfield
                                        id="quantity"
                                        className="quantity"
                                        label="Quantity"
                                        value={quantity}
                                        onChange={handleQuantity}
                                    />
                                </div>
                                <div className="form-element prescription--frequency">
                                    <label
                                        className="label--frequency form-input__header"
                                        htmlFor="prescription-frequency"
                                    >
                                        Frequency
                                    </label>
                                    <Select
                                        providerModal={true}
                                        initialValue={frequency}
                                        id="prescription-frequency"
                                        options={FREQUENCY_OPTIONS}
                                        placeholder="Frequency"
                                        onChange={(value) => setFrequency(value)}
                                    />
                                </div>
                            </div>
                        </div>
                        {packageOptions?.length > 0 && (
                            <div className="form-element">
                                <label className="label--packaging form-input__header" htmlFor="prescription-packaging">
                                    Packaging
                                </label>
                                <Select
                                    providerModal={true}
                                    id="prescription-packaging"
                                    initialValue={dosagePackage}
                                    options={packageOptions}
                                    placeholder="Packaging"
                                    onChange={setDosagePackage}
                                />
                            </div>
                        )}
                    </div>
                    {isMobile ? null : <hr />}
                    <div className="dialog--actions">
                        <Button
                            className="mr-2"
                            label="Cancel"
                            onClick={onClose}
                            type="secondary"
                            data-gtm="button-update-prescription"
                        />
                        <Button
                            label="Save Changes"
                            onClick={handleSave}
                            disabled={!isFormValid || isSaving}
                            data-gtm="button-cancel-update-prescription"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
