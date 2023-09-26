import { useState } from "react";
import Box from "@mui/material/Box";
import * as Sentry from "@sentry/react";

import useUserProfile from "hooks/useUserProfile";
import useToast from "hooks/useToast";
import { useWindowSize } from "hooks/useWindowSize";
import { CarrierField } from "./CarrierField";
import { ProductField } from "./ProductField";
import { StateField } from "./StateField";
import { PlanYearField } from "./PlanYearField";
import { ProducerIdField } from "./ProducerIdField";
import { CancelButton } from "./CancelButton";
import { AddButton } from "./AddButton";
import useSelectOptions from "../hooks/useSelectOptions";
import { getSnpTypes } from "../utils/helper";
import useFetch from "hooks/useFetch";
import { useSAPermissionsContext } from "../SAPermissionProvider";

import styles from "./styles.module.scss";

const AGENTS_API_VERSION = "v1.0";

function SAAddPermissionForm() {
  const [carrier, setCarrier] = useState("");
  const [product, setProduct] = useState("");
  const [state, setState] = useState("");
  const [year, setYear] = useState("");
  const { npn } = useUserProfile();
  const addToast = useToast();
  const { width: windowWidth } = useWindowSize();
  const { agents, handleCancel, fetchTableData, isAdding, setIsLoading } =
    useSAPermissionsContext();
  const {
    carriersOptions,
    getProductsOptions,
    getPlanYearOptions,
    getProducerID,
    carriersGroup,
  } = useSelectOptions(agents);

  const URL = `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentsSelfService/attestation/${npn}`;

  const { Post: addAgentSelfAttestation } = useFetch(URL);

  const productsOptions = getProductsOptions(carrier);
  const planYearOptions = getPlanYearOptions(carrier);
  const producerId = getProducerID(carrier);
  const selectedCarrierGroup = carriersGroup[carrier];
  const isMobile = windowWidth <= 784;

  const resetAllFields = () => {
    setCarrier("");
    setProduct("");
    setState("");
    setYear("");
  };

  const onCarrierChange = (value) => {
    setCarrier(value);
    setProduct("");
    setState("");
    setYear("");
  };

  const onProductChange = (value) => {
    setProduct(value);
    setState("");
    setYear("");
  };

  const onStateChange = (value) => {
    setState(value);
    setYear("");
  };

  const OnCancelClickHandle = () => {
    resetAllFields();
    handleCancel();
  };

  const OnAddClickHandle = async () => {
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
          agentProducerID: producerId,
          snpTypes: getSnpTypes(product),
          stateExpirationDate: "",
        },
      ],
    };
    try {
      setIsLoading(true)
      await addAgentSelfAttestation(payload);
      await fetchTableData();
      resetAllFields();
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      Sentry.captureException(error);
      addToast({
        type: "error",
        message: "Failed to add record",
        time: 10000,
      });
    }
  };

  if (!isAdding) return <></>;

  return (
    <>
      {!isMobile && (
        <tbody className={styles.customBody}>
          <tr>
            <td>
              <CarrierField
                carrier={carrier}
                setCarrier={onCarrierChange}
                options={carriersOptions}
              />
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
              <StateField
                product={product}
                state={state}
                setState={onStateChange}
              />
            </td>
            <td>
              <PlanYearField
                state={state}
                year={year}
                setYear={setYear}
                options={planYearOptions}
              />
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
          </tr>
        </tbody>
      )}
      {isMobile && (
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
          <StateField
            product={product}
            state={state}
            setState={onStateChange}
            isMobile={isMobile}
          />
          <PlanYearField
            state={state}
            year={year}
            setYear={setYear}
            options={planYearOptions}
            isMobile={isMobile}
          />
          <ProducerIdField producerId={producerId} isMobile={isMobile} />
          <CancelButton
            OnCancelClickHandle={OnCancelClickHandle}
            isMobile={isMobile}
          />
          <AddButton OnAddClickHandle={OnAddClickHandle} isMobile={isMobile} />
        </Box>
      )}
    </>
  );
}

export default SAAddPermissionForm;
