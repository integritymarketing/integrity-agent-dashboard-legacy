import { Typography, Box, Grid, Checkbox, FormControlLabel, Button, useMediaQuery, useTheme } from "@mui/material";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import IulPlanCardLogo from "components/icons/LifeIul/logo";
import Award from "components/icons/LifeIul/award";
import Medal from "components/icons/LifeIul/medal";
import FullWidthButton from "components/ui/FullWidthButton";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const getHealthClassFullForm = (healthClass) => {
    switch (healthClass) {
        case "S":
            return "Standard";
        case "P":
            return "Preferred";
        case "SP":
            return "Standard Plus";
        case "PP":
            return "Preferred Best";
        default:
            return "";
    }
};

const CardInnerHeader = ({ title, companyName, rating, logo }) => (
    <Grid container className={styles.cardInnerHeader} gap={1}>
        <Grid item>
            <Box>
                <Typography variant="h4" color="#052A63">
                    {title}
                </Typography>
            </Box>
            <Box display="flex" marginTop="10px">
                <Typography variant="body1" color="#434A51">
                    {companyName}
                </Typography>
                <Box className={styles.divider} />
                <Typography variant="body1" color="#434A51">
                    {rating}
                </Typography>
            </Box>
        </Grid>
        <Grid item>{logo ? <img className={styles.planLogo} src={logo} alt="iul-logo" /> : <IulPlanCardLogo />}</Grid>
    </Grid>
);

CardInnerHeader.propTypes = {
    title: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
    rating: PropTypes.string.isRequired,
    logo: PropTypes.string,
};

const AmoutInfo = ({ label, value }) => (
    <Grid item className={styles.amountInfo}>
        <Box className={styles.label}>{label}</Box>
        <Typography variant="body1" color="#717171">
            {value}
        </Typography>
    </Grid>
);

AmoutInfo.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

const CardContent = ({
    cashValueYear10,
    cashValueYear20,
    cashValueAge65,
    maxIllustratedRate,
    indexStrategyType,
    targetPremium,
    distribution,
    deathBenefit,
    quoteType,
    premium,
}) => (
    <Grid container className={styles.cardInnerContent} gap={1}>
        <Grid item container className={styles.cardContent} gap={1} md={8.5} sm={7} xs={12}>
            <AmoutInfo label="CSV yr 10" value={`$${cashValueYear10}`} />
            <AmoutInfo label="CSV yr 20" value={`$${cashValueYear20}`} />
            <AmoutInfo label="CSV yr A65" value={`$${cashValueAge65}`} />
            <AmoutInfo label="Rate" value={`${maxIllustratedRate}%`} />
            <AmoutInfo label="Index" value={indexStrategyType === "carrierBest" ? <Award /> : <Medal />} />
        </Grid>
        <Grid item md={3} sm={4.5} xs={12}>
            <Box className={styles.maxDistInfo}>
                <Box className={styles.label}> {quoteType === "IUL Accumulation" ? "Max Dist" : "Premium"}</Box>
                <Typography variant="h2" color="#052A63">
                    ${quoteType === "IUL Accumulation" ? distribution : premium}
                </Typography>
                {quoteType === "IUL Accumulation" && (
                    <Typography variant="body1" color="#434A51">
                        Initial DB: ${deathBenefit}
                    </Typography>
                )}
                <Typography variant="body1" color="#434A51">
                    Target: ${targetPremium}
                </Typography>
            </Box>
        </Grid>
    </Grid>
);

CardContent.propTypes = {
    cashValueYear10: PropTypes.string.isRequired,
    cashValueYear20: PropTypes.string.isRequired,
    cashValueAge65: PropTypes.string.isRequired,
    maxIllustratedRate: PropTypes.string.isRequired,
    indexStrategyType: PropTypes.string.isRequired,
    targetPremium: PropTypes.string.isRequired,
    distribution: PropTypes.string.isRequired,
    deathBenefit: PropTypes.string.isRequired,
    quoteType: PropTypes.string.isRequired,
    premium: PropTypes.string.isRequired,
};

const CardFooter = ({ isTobaccoUser, age, healthClass }) => (
    <Box className={styles.cardInnerFooter}>
        <Box>
            <Typography variant="body2" color="#434A51">
                {getHealthClassFullForm(healthClass)} {isTobaccoUser ? "Tobacco" : "Non-Tobacco"}
            </Typography>
        </Box>

        <Box>
            <Typography variant="body2" color="#434A51">
                Nearest Age: {age}
            </Typography>
        </Box>
    </Box>
);

CardFooter.propTypes = {
    isTobaccoUser: PropTypes.bool.isRequired,
    age: PropTypes.string.isRequired,
    healthClass: PropTypes.string.isRequired,
};

const CardActions = ({ isMobile, navigateToPlanDetailsPage }) => (
    <Box className={styles.cardFooterActions}>
        <Box>
            <FormControlLabel value="end" control={<Checkbox />} label="Compare" labelPlacement="end" />
        </Box>
        <Box item>
            <Button variant="text" color="primary" size="small" onClick={navigateToPlanDetailsPage}>
                Policy Details
            </Button>
        </Box>
        {!isMobile && (
            <Box>
                <Button variant="contained" color="primary" size="large" endIcon={<ButtonCircleArrow />}>
                    Apply
                </Button>
            </Box>
        )}
    </Box>
);

CardActions.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    navigateToPlanDetailsPage: PropTypes.func,
};

export const IulQuoteCard = ({
    cardTitle = "",
    companyName = "",
    rating = "",
    logo = null,
    cashValueYear10,
    cashValueYear20,
    cashValueAge65,
    maxIllustratedRate,
    indexStrategyType,
    isTobaccoUser,
    targetPremium,
    deathBenefit,
    distribution,
    age,
    healthClass,
    quoteType,
    premium,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
    const navigateToPlanDetailsPage = () => {
        navigate("/life/iul-accumulation/12345/quote-details");
    };

    return (
        <Box className={styles.cardOuterContainer}>
            <Box className={styles.cardInnerContainer}>
                <CardInnerHeader title={cardTitle} companyName={companyName} rating={rating} logo={logo} />
                <CardContent
                    cashValueYear10={cashValueYear10}
                    cashValueYear20={cashValueYear20}
                    cashValueAge65={cashValueAge65}
                    maxIllustratedRate={maxIllustratedRate}
                    indexStrategyType={indexStrategyType}
                    targetPremium={targetPremium}
                    distribution={distribution}
                    deathBenefit={deathBenefit}
                    quoteType={quoteType}
                    premium={premium}
                />

                <CardFooter isTobaccoUser={isTobaccoUser} age={age} healthClass={healthClass} />
            </Box>
            <Box className={styles.cardFooter}>
                <CardActions isMobile={isMobile} navigateToPlanDetailsPage={navigateToPlanDetailsPage} />
                {isMobile && (
                    <Box marginTop="8px" width="100%">
                        <FullWidthButton
                            label="Apply"
                            type="primary"
                            icon={<ButtonCircleArrow />}
                            iconPosition="right"
                            style={{ border: "none" }}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};
IulQuoteCard.propTypes = {
    cardTitle: PropTypes.string,
    companyName: PropTypes.string,
    rating: PropTypes.string,
    logo: PropTypes.node,
    cashValueYear10: PropTypes.number,
    cashValueYear20: PropTypes.number,
    cashValueAge65: PropTypes.number,
    maxIllustratedRate: PropTypes.number,
    indexStrategyType: PropTypes.string,
    isTobaccoUser: PropTypes.bool,
    targetPremium: PropTypes.number,
    deathBenefit: PropTypes.number,
    distribution: PropTypes.string,
    age: PropTypes.number,
    healthClass: PropTypes.string,
    quoteType: PropTypes.string,
    premium: PropTypes.number,
};
