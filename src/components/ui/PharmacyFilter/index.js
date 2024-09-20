import { useCallback } from "react";
import { usePharmacyContext } from "providers/PharmacyProvider/usePharmacyContext";
import { Formik, Field, Form } from "formik";
import PropTypes from "prop-types";
import "./index.scss";

export default function PharmacyFilter() {
    const { pharmacies, pharmacyLoading, selectedPharmacy, setSelectedPharmacy } = usePharmacyContext();

    const handleFilterChange = useCallback(
        (event) => {
            const newPharmacy =
                event.target.value === "Mail Order"
                    ? { name: "Mail Order" }
                    : [...pharmacies].find((pharmacy) => pharmacy.name == event.target.value);

            // pass selected pharmacy into callback to update data
            setSelectedPharmacy(newPharmacy);
        },
        [pharmacies, setSelectedPharmacy],
    );

    return (
        <Formik
            // set default selection to selectedPharmacy if available
            initialValues={{
                picked: selectedPharmacy?.name ? selectedPharmacy.name : "Mail Order",
            }}
        >
            {/* Handle filter changes when form is updated */}
            <Form onChange={(event) => handleFilterChange(event)}>
                <fieldset
                    id="pharmacy-filter-fieldset"
                    className="pharmacy-filter"
                    style={{ border: 0, padding: 0, margin: 0, display: "flex", flexDirection: "column" }}
                    aria-labelledby="pharmacy-filter-header"
                >
                    <legend id="pharmacy-filter-header" className="header">
                        Estimates Based On:
                    </legend>

                    {!pharmacyLoading && (
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
                                        value={pharmacy.name}
                                        checked={pharmacy?.name === selectedPharmacy?.name}
                                    />
                                    {pharmacy.name}
                                </label>
                            ))}

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

PharmacyFilter.propTypes = {
    pharmacies: PropTypes.array.isRequired,
    selectedPharmacy: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};
