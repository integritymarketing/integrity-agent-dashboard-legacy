import { useCreateNewQuote } from "providers/CreateNewQuote";

import { useState, useCallback } from "react";

import { Divider } from "@mui/material";
import Box from "@mui/material/Box";

import useFetch from "hooks/useFetch";
import useUserProfile from "hooks/useUserProfile";

import { SellingPermissionsModal } from "components/FinalExpensePlansContainer/FinalExpenseContactDetailsForm/SellingPermissionsModal";
import { AGENT_SERVICE_NON_RTS } from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";

import Checkbox from "components/ui/Checkbox";
import { LifeHealthProducts } from "../../Common";

const SelectProductCard = () => {
    const [showSellingPermissionModal, setShowSellingPermissionModal] = useState(false);

    const { handleSelectedProductType, setDoNotShowAgain, DoNotShowAgain } = useCreateNewQuote();

    const { npn } = useUserProfile();

    const { Get: getAgentNonRTS } = useFetch(`${AGENT_SERVICE_NON_RTS}${npn}`);

    const handleHealthPlanClick = () => {
        handleSelectedProductType("health");
    };

    const handleLifePlanClick = useCallback(async () => {
        const isAgentNonRTS = await getAgentNonRTS();
        if (isAgentNonRTS === "True") {
            setShowSellingPermissionModal(true);
        } else {
            handleSelectedProductType("life");
        }
    }, [getAgentNonRTS]);

    const handleContinue = () => {
        handleSelectedProductType("life");
    };

    return (
        <>
            <LifeHealthProducts
                handleLifePlanClick={handleLifePlanClick}
                handleHealthPlanClick={handleHealthPlanClick}
            />
            <Divider />
            <Box display="flex" gap="0px" alignItems="center" justifyContent="center" marginTop="30px">
                <Checkbox
                    label="Don't show this again"
                    checked={DoNotShowAgain}
                    onChange={() => setDoNotShowAgain(!DoNotShowAgain)}
                />
            </Box>

            <SellingPermissionsModal
                showSellingPermissionModal={showSellingPermissionModal}
                handleModalClose={() => {
                    setShowSellingPermissionModal(false);
                }}
                handleContinue={handleContinue}
            />
        </>
    );
};

export default SelectProductCard;
