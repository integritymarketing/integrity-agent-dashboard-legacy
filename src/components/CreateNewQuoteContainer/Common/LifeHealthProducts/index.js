import { Box } from "@mui/material";
import ProductOption from "./option";
import HealthIcon from "components/icons/healthIcon";
import LifeIcon from "components/icons/lifeIcon";

import styles from "./styles.module.scss";

const LifeHealthProducts = ({ handleLifePlanClick, handleHealthPlanClick }) => {
    return (
        <Box className={styles.container}>
            <ProductOption label="LifeCENTER" icon={<LifeIcon />} onClick={handleLifePlanClick} />
            <ProductOption label="HealthCENTER" icon={<HealthIcon />} onClick={handleHealthPlanClick} />
        </Box>
    );
};

export default LifeHealthProducts;
