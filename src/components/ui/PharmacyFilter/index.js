import { useState, useEffect, useCallback } from "react";
import { usePharmacyContext } from "providers/PharmacyProvider/usePharmacyContext";
import { Formik, Field, Form } from "formik";
import { Select } from "components/ui/Select";
import PropTypes from "prop-types";
import "./index.scss";

export default function PharmacyFilter({ type = "radio" }) {
    const { pharmacies, pharmacyLoading, selectedPharmacy, setSelectedPharmacy } = usePharmacyContext();

 
    const featureFlag = process.env.REACT_APP_PHARMACY_FILTER_SHOW_MAILORDER === "true";

    const handleFilterChange = useCallback(
        (payload) => {
            const newPharmacy =
                payload === "Mail Order"
                    ? { name: "Mail Order" }
                    : pharmacies.find((pharmacy) => pharmacy.pharmacyId == payload);

            // pass selected pharmacy into callback to update data
            setSelectedPharmacy(newPharmacy);
        },
        [pharmacies, setSelectedPharmacy],
    );

    useEffect(() => {
        if (!pharmacyLoading && pharmacies.length === 1) {
            setSelectedPharmacy(pharmacies[0]);
        }
    }, [pharmacies, pharmacyLoading, setSelectedPharmacy]);

    if (type == "radio") {
        return (
            <Formik
                // set default selection to selectedPharmacy if available
                initialValues={{
                    picked: selectedPharmacy?.name ? selectedPharmacy.name : "Mail Order",
                }}
            >
                {/* Handle filter changes when form is updated */}
                <Form onChange={(event) => handleFilterChange(event.target.value)}>
                    <fieldset
                        id="pharmacy-filter-fieldset"
                        className="pharmacy-filter"
                        style={{ border: 0, padding: 0, margin: 0, display: "flex", flexDirection: "column" }}
                        aria-labelledby="pharmacy-filter-header"
                    >
                        <legend id="pharmacy-filter-header" className="header">
                            Estimates Based On:
                        </legend>

                        {!pharmacyLoading && pharmacies.length > 0 ? (
                            <>
                                {/* Dynamic Options */}
                                {pharmacies.map((pharmacy) => (
                                    <label
                                        htmlFor={`option-${pharmacy.pharmacyId}`}
                                        style={{ display: "flex", gap: "1ch" }}
                                        key={pharmacy.pharmacyId}
                                    >
                                        <Field
                                            id={`option-${pharmacy.pharmacyId}`}
                                            type="radio"
                                            name="picked"
                                            value={pharmacy.pharmacyId}
                                            checked={pharmacy?.name === selectedPharmacy?.name}
                                        />
                                        {pharmacy.name}
                                    </label>
                                ))}

                                {featureFlag && (
                                    <label htmlFor="option-mail-order" style={{ display: "flex", gap: "1ch" }}>
                                        <Field id="option-mail-order" type="radio" name="picked" value="Mail Order" />
                                        Mail Order
                                    </label>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Static Option */}
                                <label htmlFor="option-mail-order" style={{ display: "flex", gap: "1ch" }}>
                                    <Field id="option-mail-order" type="radio" name="picked" value="Mail Order" />
                                    Mail Order
                                </label>
                            </>
                        )}
                    </fieldset>
                </Form>
            </Formik>
        );
    }

    if (type == "select") {
        const mailOrderOption = { value: "Mail Order", label: "Mail Order" };
        const [selectOptions, setSelectOptions] = useState([mailOrderOption]);
        const [selectInitial, setSelectInitial] = useState(mailOrderOption);

        useEffect(() => {
            if (!pharmacyLoading && pharmacies.length > 0) {
                const options = pharmacies.map(pharmacy => ({ value: pharmacy.pharmacyId, label: pharmacy.name }));
                if (featureFlag) {
                    options.push(mailOrderOption);
                }
                setSelectOptions(options);
            } else {
                setSelectOptions([mailOrderOption]);
            }

            if (!selectedPharmacy.pharmacyId) {
                if (pharmacies.length) {
                    const primaryPharmacy = pharmacies.find(pharmacy => pharmacy.isPrimary);
                    if (primaryPharmacy) {
                        setSelectInitial({ value: primaryPharmacy.pharmacyId, label: primaryPharmacy.name });
                    }
                } else {
                    setSelectInitial(mailOrderOption);
                }
            } else {
                setSelectInitial({ value: selectedPharmacy.pharmacyId, label: selectedPharmacy.name });
            }

        }, [pharmacies]);

        return (
            <label id="pharmacy-select-label" htmlFor="pharmacy-filter-select" className="pharmacy-filter">
                <span className="select-label">Estimates Based On</span>
                {!pharmacyLoading &&
                    <Select
                        initialValue={selectInitial.value}
                        options={selectOptions}
                        id="pharmacy-filter-select"
                        onChange={(event) => handleFilterChange(event)}
                        showValueAlways={true}
                        style={{
                            width: "275px",
                        }}
                    />
                }
            </label>
        );
    }
}

PharmacyFilter.propTypes = {
    type: PropTypes.string,
};
