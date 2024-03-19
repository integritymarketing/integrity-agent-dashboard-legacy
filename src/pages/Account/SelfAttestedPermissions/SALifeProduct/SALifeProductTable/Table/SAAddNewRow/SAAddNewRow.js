import { useState } from "react";

import Box from "@mui/material/Box";
import useDeviceType from "hooks/useDeviceType";

import useDataHandler from "../../../hooks/useDataHandler";
import useUserProfile from "hooks/useUserProfile";
import useAnalytics from "hooks/useAnalytics";
import SaveBlue from "components/icons/version-2/SaveBlue";
import { Button } from "components/ui/Button";
import { Select } from "components/ui/Select";
import Textfield from "components/ui/textfield";

import { useSAPermissionsContext } from "pages/Account/SelfAttestedPermissions/providers/SAPermissionProvider";

import styles from "./styles.module.scss";

import { useSALifeProductContext } from "../../../providers/SALifeProductProvider";

// eslint-disable-next-line max-lines-per-function
function SAAddNewRow() {
    const [error, setError] = useState(null);
    const [producerIdValue, setProducerIdValue] = useState("");
    const [selectedCarrier, setSelectedCarrier] = useState(null);
    const { options, originals } = useSALifeProductContext();
    const { addRecord } = useDataHandler();
    const { isAddingLife, handleCancelLife } = useSAPermissionsContext();
    const { npn } = useUserProfile();
    const { fireEvent } = useAnalytics();
    const { isMobile } = useDeviceType();

    const shouldDisable = !producerIdValue || !selectedCarrier || error;

    const onChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length <= 13) {
            setProducerIdValue(inputValue);
        }
    };

    const validateInput = (input) => {
        const alphanumericRegex = /^[a-z0-9]+$/i;

        if (!alphanumericRegex.test(input)) {
            return "Input must contain only alphanumeric characters.";
        }

        if (input.length < 1 || input.length > 13) {
            return "Input must be between 1 and 13 characters long.";
        }

        return null;
    };

    const onBlur = () => {
        const validatedError = validateInput(producerIdValue);
        if (validatedError) {
            setError(validatedError);
        } else {
            setError(null);
        }
    };

    const onSaveHandle = () => {
        const original = originals.find((record) => record.carrierId === selectedCarrier);
        const payload = {
            agentNPN: npn,
            carrierName: original?.carrierName,
            displayCarrierName: original?.displayCarrierName,
            carrierId: original?.carrierId,
            productNames: [],
            producerId: producerIdValue,
            isSelfAttested: "Yes",
            inActive: 0,
            naic: original?.naic,
        };
        addRecord(payload);
        fireEvent("RTS Attestation Added", {
            line_of_business: "Life",
            product_type: "final_expense",
            leadid: npn,
            carrier: original?.carrierName,
        });
        OnCancelClickHandle();
    };

    const resetAllFields = () => {
        setSelectedCarrier(null);
        setProducerIdValue("");
        setError(null);
    };

    const OnCancelClickHandle = () => {
        resetAllFields();
        handleCancelLife();
    };

    if (!isAddingLife || !options) {
        return <></>;
    }

    return (
        <>
            {!isMobile && (
                <tbody className={styles.customBody}>
                    <tr>
                        <td>
                            <Box className={styles.customBodyRow}>
                                <Box className={styles.title}>Carrier</Box>
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder="Select"
                                    options={options}
                                    initialValue={selectedCarrier}
                                    onChange={setSelectedCarrier}
                                    showValueAlways={false}
                                />
                            </Box>
                        </td>
                        <td>
                            <Box className={styles.customBodyRow}>
                                <Box className={styles.title}>Product</Box>
                                <Select
                                    placeholder="Final Expense"
                                    style={{ width: "360px" }}
                                    showValueAlways={false}
                                    disabled={true}
                                />
                            </Box>
                        </td>
                        <td>
                            <Box className={styles.customTextField}>
                                <Box className={styles.title}>Producer ID</Box>
                                <>
                                    <Textfield
                                        value={producerIdValue}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        error={error ? true : false}
                                        hideFieldError={true}
                                    />
                                    {error && <Box className={styles.errorMessage}>{error}</Box>}
                                </>
                            </Box>
                        </td>
                        <td></td>
                        <td>
                            <Box
                                display="flex"
                                textAlign="center"
                                justifyContent="right"
                                paddingRight="20px"
                                gap="40px"
                            >
                                <Button
                                    label="Cancel"
                                    className={styles.buttonWithIcon}
                                    onClick={handleCancelLife}
                                    type="tertiary"
                                />
                                <Button
                                    icon={<SaveBlue />}
                                    label="Save"
                                    className={styles.buttonWithIcon}
                                    onClick={onSaveHandle}
                                    type="tertiary"
                                    iconPosition="right"
                                    disabled={shouldDisable}
                                />
                            </Box>
                        </td>
                    </tr>
                </tbody>
            )}
            {isMobile && (
                <>
                    <Box className={styles.mobileContainer}>
                        <Box>
                            <Box className={styles.title}>Carrier</Box>
                            <Select
                                style={{ width: "100%" }}
                                placeholder="Select"
                                options={options}
                                initialValue={selectedCarrier}
                                onChange={setSelectedCarrier}
                                showValueAlways={false}
                            />
                        </Box>
                        <Box>
                            <Box className={styles.title}>Product</Box>
                            <Select
                                placeholder="Final Expense"
                                style={{ width: "100%" }}
                                showValueAlways={false}
                                disabled={true}
                            />
                        </Box>
                        <Box className={styles.fieldAndActions}>
                            <Box width={"45%"}>
                                <Box className={styles.title}>Producer ID</Box>
                                <>
                                    <Textfield
                                        value={producerIdValue}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        error={error ? true : false}
                                        hideFieldError={true}
                                    />
                                    {error && <Box className={styles.errorMessage}>{error}</Box>}
                                </>
                            </Box>
                            <Box
                                display="flex"
                                textAlign="center"
                                marginTop={"10px"}
                                width={"45%"}
                                justifyContent={"space-between"}
                            >
                                <Button
                                    label="Cancel"
                                    className={styles.buttonWithIcon}
                                    onClick={OnCancelClickHandle}
                                    type="tertiary"
                                />
                                <Button
                                    icon={<SaveBlue />}
                                    label="Save"
                                    className={styles.buttonWithIcon}
                                    onClick={onSaveHandle}
                                    type="tertiary"
                                    iconPosition="right"
                                    disabled={shouldDisable}
                                />
                            </Box>
                        </Box>
                    </Box>
                    {error && <Box className={styles.error}>{error}</Box>}
                </>
            )}
        </>
    );
}

export default SAAddNewRow;
