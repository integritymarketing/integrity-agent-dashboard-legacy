import PropTypes from "prop-types";
import { useMemo } from "react";
import { Button, Box, Grid } from "@mui/material";
import TextFormatter from "components/Shoppers/ShoppersTextFormat";
import ArrowForwardWithCircle from "components/icons/version-2/ArrowForwardWithCircle";
import AskIntegritySuggests from "components/icons/activities/AskIntegritySuggests";
import { useNavigate } from "react-router-dom";
import { getShoppersColorScheme, isHaveCarrierId } from "utils/shared-utils/sharedUtility";

import styles from "./styles.module.scss";

const ShoppersCard = ({ leadId, title, content, url, icon, activityInteractionLabel, activityInteractionIcon }) => {
    const navigate = useNavigate();
    const priority = title?.includes("1") ? "1" : title?.includes("2") ? "2" : "3";
    const isShopper = title?.toLowerCase()?.includes("shopper priority");

    const { color, bgColor } = getShoppersColorScheme(priority);

    const handleCarrierClick = () => {
        const decodedURI = decodeURIComponent(url);
        const [, queryString] = decodedURI.split("?");

        navigate(`/plans/${leadId}?${queryString}`);
    };

    const handleAllPlansClick = () => {
        navigate(`/plans/${leadId}`);
    };

    const showButton = isHaveCarrierId(url);

    return (
        <Grid container className={styles.shoppersCard}>
            <Grid item md="1.5" xs="2">
                {icon ? (
                    <Box
                        className={styles.iconWrapper}
                        sx={{
                            background: bgColor,
                        }}
                    >
                        <img src={icon} alt="shoppersImage" />
                    </Box>
                ) : (
                    <AskIntegritySuggests color={color} bgColor={bgColor} />
                )}
            </Grid>
            <Grid item md="10.5" xs="10">
                <Box className={styles.shoppersHeader}>{title}</Box>
                <TextFormatter inputText={content} fontSize="14px" color="#717171" />
                {url && (
                    <Box className={styles.plansButtons}>
                        {showButton && (
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                endIcon={activityInteractionIcon ? activityInteractionIcon : <ArrowForwardWithCircle />}
                                onClick={handleCarrierClick}
                            >
                                {activityInteractionLabel}
                            </Button>
                        )}

                        {isShopper && (
                            <Button
                                size="small"
                                variant="text"
                                color="primary"
                                endIcon={<ArrowForwardWithCircle color="#4178FF" />}
                                onClick={handleAllPlansClick}
                            >
                                All Available Plans
                            </Button>
                        )}
                    </Box>
                )}
            </Grid>
        </Grid>
    );
};

ShoppersCard.propTypes = {
    leadId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    url: PropTypes.string,
    icon: PropTypes.string,
    activityInteractionLabel: PropTypes.string,
    activityInteractionIcon: PropTypes.string,
};

export default ShoppersCard;
