import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { AGENT_FNAME, AGENT_LNAME, AGENT_PHONE, INITIAL_METHOD_OF_CONTACT } from '../ScopeOfAppointmentContainer.constants';
import styles from "./FormInputs.module.scss";

import { FormField } from 'components/SharedFormFields/FormField';
import { SelectStateField } from 'components/SharedFormFields/SelectStateField';
// import { getFirstNameSchema, getLastNameSchema } from 'schemas';




// const validationSchema = Yup.object().shape({
//     ...getFirstNameSchema,
//     ...getLastNameSchema
// });

export const FormInputs = ({ formInputs, setFormInputs, }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormInputs({ ...formInputs, [name]: value });
    }


    return (
        <Formik
            initialValues={formInputs}
        //validationSchema={validationSchema}
        >
            <Form>
                <FormField label={AGENT_FNAME}
                    name={"firstName"}
                    className={styles.fieldContainer}
                    labelClassName={styles.label}
                    placeholder="First Name"
                    width={"50%"}
                    initialValue={formInputs.firstName}
                    onChange={handleChange}
                    required />

                <FormField label={AGENT_LNAME}
                    name={"lastName"}
                    className={styles.fieldContainer}
                    labelClassName={styles.label}
                    placeholder="Last Name"
                    width={"50%"}
                    initialValue={formInputs.lastName}
                    onChange={handleChange}
                    required />


                <FormField label={AGENT_PHONE}
                    name={"phoneNumber"}
                    className={styles.fieldContainer}
                    labelClassName={styles.label}
                    placeholder="Phone Number"
                    initialValue={formInputs.phoneNumber}
                    onChange={handleChange}
                    width={"50%"} />

                <FormField label={INITIAL_METHOD_OF_CONTACT}
                    name={"methodOfContact"}
                    className={styles.fieldContainer}
                    labelClassName={styles.label}
                    placeholder="Method of Contact"
                    initialValue={formInputs.methodOfContact}
                    onChange={handleChange}
                    width={"50%"} />
            </Form>
        </Formik>
    )
}

FormInputs.propTypes = {
    onSubmit: PropTypes.func.isRequired
};