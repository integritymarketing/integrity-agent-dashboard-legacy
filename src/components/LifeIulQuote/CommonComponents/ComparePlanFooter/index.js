import { Box, Typography, Button, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IulPlanCardLogo from "components/icons/LifeIul/logo";
import styles from "./styles.module.scss";
import PropTypes from 'prop-types';

const ComparePlansFooter = ({ onClose, plans }) => {
    return (
        <Box className={styles.comparePlanFooter}>
            <Grid container spacing={{ md: 9, sm: 4 }} className={styles.plansFooterContainer}>
                {[0, 1, 2].map((index) => {
                    const plan = plans[index];
                    return (
                        <Grid item xs={12} md={3} sm={3.3} className={styles.planGridItem} key={index}>
                            {plan ? (
                                <Box className={styles.planBox}>
                                    <Box className={styles.logoCloseContainer}>
                                        {plan.logo ? (
                                            <img className={styles.planLogo} src={plan.logo} alt="iul-logo" />
                                        ) : (
                                            <IulPlanCardLogo />
                                        )}
                                        <Box onClick={() => onClose(plan)} sx={{ cursor: "pointer" }}>
                                            <CloseIcon color="primary" />
                                        </Box>
                                    </Box>
                                    <Typography variant="h4" color="#052A63">
                                        {plan.name}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box className={styles.placeholder}>
                                    <Typography variant="h4" color="#434A51">
                                        Plan {index + 1}
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    );
                })}
                <Grid item xs={12} md={2} sm={2} className={styles.compareButtonContainer}>
                    <Button
                        size="medium"
                        variant="contained"
                        color="primary"
                        disabled={plans.length < 2}
                        className={styles.compareButton}
                    >
                        Compare
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

ComparePlansFooter.propTypes = {
    onClose: PropTypes.func.isRequired,
    plans: PropTypes.arrayOf(PropTypes.shape({
        logo: PropTypes.string,
        name: PropTypes.string
    })).isRequired
};

export default ComparePlansFooter;