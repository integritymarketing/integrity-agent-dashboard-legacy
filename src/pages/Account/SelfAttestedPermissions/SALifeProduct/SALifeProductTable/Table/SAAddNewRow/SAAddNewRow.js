import { useState } from "react";

import Box from "@mui/material/Box";

import useDataHandler from "../../../hooks/useDataHandler";
import useUserProfile from "hooks/useUserProfile";

import SaveBlue from "components/icons/version-2/SaveBlue";
import { Button } from "components/ui/Button";
import { Select } from "components/ui/Select";
import Textfield from "components/ui/textfield";

import { useSAPermissionsContext } from "pages/Account/SelfAttestedPermissions/providers/SAPermissionProvider";

import styles from "./styles.module.scss";

import { useSALifeProductContext } from "../../../providers/SALifeProductProvider";

function SAAddNewRow() {
    const [producerIdValue, setProducerIdValue] = useState("");
    const [selectedCarrier, setSelectedCarrier] = useState(null);
    const { options, originals } = useSALifeProductContext();
    const { addRecord } = useDataHandler();
    const { isAddingLife, handleCancelLife } = useSAPermissionsContext();
    const { npn } = useUserProfile();

    const shouldDisable = !producerIdValue || !selectedCarrier;

    const onChange = (e) => {
        setProducerIdValue(e.target.value);
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
        };
        addRecord(payload);
        handleCancelLife();
    };

    if (!isAddingLife || !options) {
        return <></>;
    }

    return (
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
                            style={{ width: "100%" }}
                            showValueAlways={false}
                            disabled={true}
                        />
                    </Box>
                </td>
                <td>
                    <Box className={styles.customTextField}>
                        <Box className={styles.title}>Producer ID</Box>
                        <Textfield value={producerIdValue} onChange={onChange} />
                    </Box>
                </td>
                <td>
                    <Box display="flex" textAlign="center" justifyContent="right" paddingRight="20px" gap="40px">
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
    );
}

export default SAAddNewRow;
