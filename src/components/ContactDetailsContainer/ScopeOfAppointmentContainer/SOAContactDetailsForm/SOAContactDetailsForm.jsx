import PropTypes from 'prop-types';
import { SOA_FORM_SUBTEXT, SOA_FORM_TEXT, } from "../ScopeOfAppointmentContainer.constants"
import styles from "./SOAContactDetailsForm.module.scss";

import { FormInputs } from '../FormInputs/FormInputs';



export const SOAContactDetailsForm = ({ onSubmit, agentSection }) => {

    return (
        <>
            <div className={styles.formWrapper}>
                <div className={styles.formText}>{SOA_FORM_TEXT}</div>
                <div className={styles.formSubText}>{SOA_FORM_SUBTEXT}</div>
                {agentSection && <FormInputs saveDetails={onSubmit} agentSection={agentSection} />}
            </div>
        </>
    )
}
SOAContactDetailsForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
};