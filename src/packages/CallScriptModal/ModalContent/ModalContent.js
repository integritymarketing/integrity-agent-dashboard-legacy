import { useState } from "react";

import { Box } from "@mui/material";

import PropTypes from "prop-types";

import { HealthScript } from "./HealthScript";
import { Layout } from "./Layout";
import { LifeScript } from "./LifeScript";

const LIFE = "LIFE";
const HEALTH = "HEALTH";

function ModalContent({ productCount, carrierCount, shouldShowOptionalHealthInfo, currentType }) {
    const [layout, setLayout] = useState(currentType);

    return (
        <Box minHeight="430px">
            <Layout layout={layout} setLayout={setLayout} />
            {layout === LIFE && <LifeScript />}
            {layout === HEALTH && (
                <HealthScript
                    shouldShowOptionalHealthInfo={shouldShowOptionalHealthInfo}
                    productCount={productCount}
                    carrierCount={carrierCount}
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
};

export default ModalContent;
