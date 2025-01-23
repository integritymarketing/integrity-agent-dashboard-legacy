import { Box, Typography } from "@mui/material";
import { InNetwork, OutNetwork, QuestionMark } from "@integritymarketing/icons";
import PropTypes from "prop-types";
import { useMemo } from "react";
import styles from "./styles.module.scss";
 
const CommissionableInfo = ({ status }) => {
    const getIcon = useMemo(() => {
        if (status === true) {
            return <InNetwork size="lg" color="#009E15" className={styles.commissionableStatusIcon} />;
        }
        if (status === false) {
            return <OutNetwork size="lg" color="#C81E27" className={styles.commissionableStatusIcon} />;
        }
        if (status === null) {
            return <QuestionMark size="lg" color="#717171" className={styles.commissionableStatusIcon} />;
        }
    }, [status]);
 
    return (
        <Box className={styles.commisionableInfo}>
            <Typography variant="body1" color="#434A51">
                Commissionable:{"  "}
            </Typography>
            <Box>{getIcon}</Box>
        </Box>
    );
};
 
CommissionableInfo.propTypes = {
    status: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
};
export default CommissionableInfo;
 