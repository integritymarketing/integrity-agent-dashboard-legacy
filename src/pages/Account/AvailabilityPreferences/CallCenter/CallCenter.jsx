import * as Sentry from "@sentry/react";
import {useEffect, useState} from "react";

import {Form, Formik} from "formik";
import {useRecoilState} from "recoil";
import {agentPhoneAtom} from "src/recoil/agent/atoms";

import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

import EditIcon from "components/icons/icon-edit";
import Textfield from "components/ui/textfield";
import Mobile from "partials/global-nav-v2/Mobile.svg";

import {useClientServiceContext} from "services/clientServiceProvider";
import validationService from "services/validationService";

import {formatPhoneNumber} from "pages/Account/helper";

import styles from "./styles.module.scss";

const CallCenterContent = () => {
    const [phone, setPhone] = useState("");
    const [callForwardNumber, setCallForwardNumber] = useState("");
    const [isEditingNumber, setIsEditingNumber] = useState(false);
    const [loading, setLoading] = useState(true);

    const {agentId} = useUserProfile();
    const showToast = useToast();
    const [phoneAtom] = useRecoilState(agentPhoneAtom);
    const {clientsService} = useClientServiceContext();

    const phoneNumber = callForwardNumber || phone;

    useEffect(() => {
        const loadAsyncData = () => {
            getAgentAvailability(agentId);
        };
        loadAsyncData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phoneAtom, agentId]);

    const getAgentAvailability = async () => {
        if (!agentId) {
            return;
        }
        try {
            setLoading(true);
            const response = await clientsService.getAgentAvailability(agentId);
            const {agentVirtualPhoneNumber, leadPreference} = response || {};
            if (!agentVirtualPhoneNumber) {
                await clientsService.generateAgentTwiloNumber(agentId);
            }

            setPhone(formatPhoneNumber(response.phone, true));
            if (response.callForwardNumber) {
                setCallForwardNumber(formatPhoneNumber(response.callForwardNumber, true));
            }
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Formik
            initialValues={{phone: phoneNumber}}
            validate={(values) => {
                const error = validationService.validatePhone(values.phone);
                if (!error) {
                    return null;
                }
                return {
                    phone: error,
                };
            }}
            onSubmit={async (values, {setSubmitting}) => {
                setSubmitting(true);
                try {
                    await clientsService.updateAgentCallForwardingNumber({
                        callForwardNumber: values.phone.replace(/[()\s-]/g, ""),
                        agentID: agentId,
                    });
                    getAgentAvailability();
                    showToast({
                        message: "Contact number updated succesfully",
                    });
                } catch (error) {
                    showToast({
                        type: "error",
                        message: "Failed to update the contact",
                    });
                    Sentry.captureException(error);
                }
                setIsEditingNumber(false);
                setSubmitting(false);
            }}
        >
            {({values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue}) => {
                return (
                    <Form>
                        <div>
                            <div className={styles.header}>
                                <p className={styles.subTitle}>Forward calls to:</p>
                                <div className={styles.editSection}>
                                    {!isEditingNumber && (
                                        <>
                                            <span onClick={() => setIsEditingNumber(true)}>Edit</span>

                                            <span onClick={() => setIsEditingNumber(true)} className={styles.editIcon}>
                                                <EditIcon/>
                                            </span>
                                        </>
                                    )}
                                    {isEditingNumber && (
                                        <>
                                            <span
                                                className={styles.saveText}
                                                onClick={() => {
                                                    setFieldValue("phone", phoneNumber);
                                                    setIsEditingNumber(false);
                                                }}
                                            >
                                                Cancel
                                            </span>
                                            <span className={styles.saveText} onClick={() => handleSubmit()}>
                                                Save
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            {!isEditingNumber ? (
                                <div className={styles.phoneText}>
                                    <div>
                                        <img src={Mobile} alt="iconmobile" className={styles.imageMobile}/>
                                    </div>
                                    <div className={styles.number}>{formatPhoneNumber(values.phone)}</div>
                                </div>
                            ) : (
                                <div className="editPhoneContainer">
                                    <Textfield
                                        id="contact-phone"
                                        type="tel"
                                        placeholder="(XXX) XXX-XXXX"
                                        name="phone"
                                        value={formatPhoneNumber(values.phone)}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.phone && errors.phone}
                                    />
                                    {errors.phone && <div className="mb-3"/>}
                                </div>
                            )}
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default CallCenterContent;
