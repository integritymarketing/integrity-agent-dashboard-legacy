/* eslint-disable max-lines-per-function */
import * as Sentry from "@sentry/react";
import { useState } from "react";

import Box from "@mui/material/Box";

import { getSnpTypes, hasDuplicate } from "../utils/helper";

import useSelectOptions from "../hooks/useSelectOptions";
import useAnalytics from "hooks/useAnalytics";
import useFetch from "hooks/useFetch";
import useUserProfile from "hooks/useUserProfile";
import useDeviceType from "hooks/useDeviceType";

import { AddButton } from "./AddButton";
import { CancelButton } from "./CancelButton";
import { CarrierField } from "./CarrierField";
import { PlanYearField } from "./PlanYearField";
import { ProducerIdField } from "./ProducerIdField";
import { ProductField } from "./ProductField";
import { StateField } from "./StateField";
import styles from "./styles.module.scss";

import { useSAPermissionsContext } from "../../providers/SAPermissionProvider";
import { useSAHealthProductContext } from "../providers/SAHealthProductProvider";
import { useSAPModalsContext } from "../providers/SAPModalProvider";

const AGENTS_API_VERSION = "v1.0";

function SAAddPermissionForm() {
    const [error, setError] = useState(null);
    const [carrier, setCarrier] = useState("");
    const [product, setProduct] = useState("");
    const [state, setState] = useState("");
    const [year, setYear] = useState("");
    const { npn } = useUserProfile();
    const { setIsErrorModalOpen } = useSAPModalsContext();
    const { fireEvent } = useAnalytics();
    const { agents, fetchTableData, setIsLoading, setError: setGlobalError } = useSAHealthProductContext();
    const { isAddingHealth, handleCancelHealth } = useSAPermissionsContext();
    const { carriersOptions, getProductsOptions, getPlanYearOptions, getProducerID, carriersGroup } =
        useSelectOptions(agents);

    const URL = `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentsSelfService/attestation/${npn}`;

    const { Post: addAgentSelfAttestation } = useFetch(URL);

    const productsOptions = getProductsOptions(carrier);
    const planYearOptions = getPlanYearOptions(carrier);
    const producerId = getProducerID(carrier);
    const selectedCarrierGroup = carriersGroup[carrier];
    const { isMobile } = useDeviceType();

    const resetAllFields = () => {
        setCarrier("");
        setProduct("");
        setState("");
        setYear("");
        setError(null);
    };

    const onCarrierChange = (value) => {
        setCarrier(value);
        setProduct("");
        setState("");
        setYear("");
        if (error) {
            setError(null);
        }
    };

    const onProductChange = (value) => {
        setProduct(value);
        setState("");
        setYear("");
        if (error) {
            setError(null);
        }
    };

    const onStateChange = (value) => {
        setState(value);
        setYear("");
        if (error) {
            setError(null);
        }
    };

    const OnCancelClickHandle = () => {
        resetAllFields();
        handleCancelHealth();
    };

    const isDuplicate = () => {
        const agentRtsData = selectedCarrierGroup[0];
        const newItem = {
            producerId: producerId,
            businessUnit: agentRtsData.businessUnit,
            carrier: carrier,
            state: state,
            planType: product,
            status: agentRtsData.status,
            planYear: year,
            blobPath: agentRtsData.blobPath,
            tin: agentRtsData.tin,
        };
        return hasDuplicate(newItem, agents);
    };

    const OnAddClickHandle = async () => {
        if (isDuplicate()) {
            setError("The new permission duplicates an active permission.");
            return;
        }
        const agentRtsData = selectedCarrierGroup[0];
        const payload = {
            agentRts: {
                awn: agentRtsData.producerId,
                bu: agentRtsData.businessUnit,
                selfAttestationDate: "",
                isSelfAttested: true,
                blobPath: agentRtsData.blobPath,
                rtS_STATUS: agentRtsData.status,
            },
            selfAttestationRequests: [
                {
                    carrier: carrier,
                    planYear: year,
                    states: [state],
                    planType: product,
                    tin: agentRtsData.tin,
                    agentProducerID: producerId,
                    snpTypes: getSnpTypes(product),
                    stateExpirationDate: "",
                },
            ],
        };
        setIsLoading(true);
        const res = await addAgentSelfAttestation(payload, true);
        fireEvent("RTS Attestation Added", {
            line_of_business: "Health",
            product_type: product,
            leadid: npn,
            carrier: carrier,
        });
        if (res.status >= 200 && res.status < 300) {
            await fetchTableData();
            resetAllFields();
            setIsLoading(false);
        } else {
            setIsLoading(false);
            Sentry.captureException(res.statusText);
            setIsErrorModalOpen(true);
            setGlobalError(true);
        }
    };

    if (!isAddingHealth) {
        return <></>;
    }

    return (
        <>
            {!isMobile && (
                <tbody className={styles.customBody}>
                    <tr className={styles.customRow}>
                        <td>
                            <CarrierField carrier={carrier} setCarrier={onCarrierChange} options={carriersOptions} />
                        </td>
                        <td>
                            <ProductField
                                product={product}
                                carrier={carrier}
                                setProduct={onProductChange}
                                options={productsOptions}
                            />
                        </td>
                        <td>
                            <StateField product={product} state={state} setState={onStateChange} />
                        </td>
                        <td>
                            <PlanYearField state={state} year={year} setYear={setYear} options={planYearOptions} />
                        </td>
                        <td>
                            <ProducerIdField producerId={producerId} />
                        </td>
                        <td>
                            <CancelButton OnCancelClickHandle={OnCancelClickHandle} />
                        </td>
                        <td>
                            <AddButton OnAddClickHandle={OnAddClickHandle} year={year} />
                        </td>
                        {error && <Box className={styles.errorTable}>{error}</Box>}
                    </tr>
                </tbody>
            )}
            {isMobile && (
                <>
                    <Box className={styles.mobileContainer}>
                        <CarrierField
                            carrier={carrier}
                            setCarrier={onCarrierChange}
                            options={carriersOptions}
                            isMobile={isMobile}
                        />
                        <ProductField
                            product={product}
                            carrier={carrier}
                            setProduct={onProductChange}
                            options={productsOptions}
                            isMobile={isMobile}
                        />
                        <StateField product={product} state={state} setState={onStateChange} isMobile={isMobile} />
                        <PlanYearField
                            state={state}
                            year={year}
                            setYear={setYear}
                            options={planYearOptions}
                            isMobile={isMobile}
                        />
                        <ProducerIdField producerId={producerId} isMobile={isMobile} />
                        <CancelButton OnCancelClickHandle={OnCancelClickHandle} isMobile={isMobile} />
                        <AddButton OnAddClickHandle={OnAddClickHandle} isMobile={isMobile} year={year} />
                    </Box>
                    {error && <Box className={styles.error}>{error}</Box>}
                </>
            )}
        </>
    );
}

export default SAAddPermissionForm;
