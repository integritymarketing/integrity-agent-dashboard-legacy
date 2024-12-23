import PropTypes from "prop-types";
import { Box } from "@mui/material";
import ProductOption from "./option";
import HealthIcon from "components/icons/healthIcon";
import LifeIcon from "components/icons/lifeIcon";

import styles from "./styles.module.scss";

const LifeHealthProducts = ({ handleLifePlanClick, handleHealthPlanClick }) => {
    return (
        <Box className={styles.container}>
            <ProductOption
                label="LifeCENTER"
                icon={<LifeIcon />}
                onClick={handleLifePlanClick}
            />
            <ProductOption
                label="MedicareCENTER"
                icon={<HealthIcon />}
                onClick={handleHealthPlanClick}
            />
        </Box>
    );
};

LifeHealthProducts.propTypes = {
    handleLifePlanClick: PropTypes.func.isRequired,
    handleHealthPlanClick: PropTypes.func.isRequired,
};

export default LifeHealthProducts;
