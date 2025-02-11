import { useState, useEffect } from "react";

import { Box } from "@mui/material";

import PropTypes from "prop-types";

import { HealthScript } from "./HealthScript";
import { Layout } from "./Layout";
import { LifeScript } from "./LifeScript";
import useAnalytics from "hooks/useAnalytics";

const LIFE = "LIFE";
const HEALTH = "HEALTH";

function ModalContent({ productCount, carrierCount, shouldShowOptionalHealthInfo, currentType, leadId }) {
    const { fireEvent } = useAnalytics();
    const [layout, setLayout] = useState(currentType);

    useEffect(() => {
        fireEvent("Call Script Viewed", {
            leadid: leadId,
            line_of_business: layout === LIFE ? "life" : "Health",
        });
    }, [fireEvent, layout, leadId]);

    return (
        <Box minHeight="430px">
            <Layout layout={layout} setLayout={setLayout} />
            {layout === LIFE && <LifeScript leadId={leadId} />}
            {layout === HEALTH && (
                <HealthScript
                    shouldShowOptionalHealthInfo={shouldShowOptionalHealthInfo}
                    productCount={productCount}
                    carrierCount={carrierCount}
                    leadId={leadId}
                />
            )}
        </Box>
    );
}

ModalContent.propTypes = {
    productCount: PropTypes.string.isRequired,
    carrierCount: PropTypes.string.isRequired,
    shouldShowOptionalHealthInfo: PropTypes.bool.isRequired,
    currentType: PropTypes.string.isRequired,
    leadId: PropTypes.string,
};

export default ModalContent;
