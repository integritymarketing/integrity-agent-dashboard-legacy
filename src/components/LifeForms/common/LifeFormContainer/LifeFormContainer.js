import PropTypes from "prop-types";
import { Box, Paper, Stack, Typography } from "@mui/material";
import styles from "./LifeFormContainer.module.scss";
import { REQUIRED_FIELDS } from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";

export const LifeFormContainer = ({ children, cardHeaderTitle, cardTitle, cardSubTitle }) => {
    return (
        <Box className={styles.productPreferenceContainer}>
            <Box className={styles.card_container}>
                <Box className={styles.card_header}>
                    <Typography variant="h2" className={styles.fontColor} gutterBottom={true}>
                        {cardHeaderTitle}
                    </Typography>
                </Box>
                <Paper elevation={0} className={styles.productPreferenceForm} sx={{ borderRadius: "8px" }}>
                    <Stack gap={4} flexGrow={1}>
                        <Stack flex>
                            <Stack>
                                <Typography variant="h3" className={styles.fontColor}>
                                    {cardTitle}
                                </Typography>
                            </Stack>
                            <Stack>
                                <Typography variant="body1" className={styles.fontColor}>
                                    {cardSubTitle}
                                </Typography>
                            </Stack>
                        </Stack>
                        {children}
                    </Stack>
                </Paper>
                <Typography variant="body2" className={styles.requiredMarkSection}>
                    {REQUIRED_FIELDS}
                </Typography>
            </Box>
        </Box>
    );
};

LifeFormContainer.propTypes = {
    cardHeaderTitle: PropTypes.string.isRequired,
    cardSubTitle: PropTypes.string.isRequired,
    cardTitle: PropTypes.string.isRequired,
    children: PropTypes.node,
};
