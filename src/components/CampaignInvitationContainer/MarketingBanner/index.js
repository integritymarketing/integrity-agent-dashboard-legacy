import React from "react";
import { Grid, Stack, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import ArrowForwardWithCircle from "../../icons/version-2/ArrowForwardWithCirlce";
import styles from "./styles.module.scss";
import bannerImage from "images/PlanEnrollBanner.svg";
import PropTypes from "prop-types";

const MarketingBanner = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Grid
            container
            sx={{
                width: { xs: "100%", sm: "600px" },
                borderRadius: isMobile ? "4px" : "8px",
                padding: isMobile ? "16px" : "8px",
                backgroundColor: "#ffffff",
                margin: "auto",
                overflow: "hidden",
                "& .MuiGrid-item": {
                    paddingRight: isMobile ? "0" : "30px",
                },
            }}
        >
            <Grid item xs={12} className={styles.bannerCardStack}>
                <Grid container direction="row" spacing={0}>
                    <Grid item xs={6} sm={4}>
                        <img className={styles.bannerCardImage} src={bannerImage} alt="Click here" />
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        sm={8}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Stack direction="column" spacing={1}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: "Lato",
                                    fontSize: isMobile ? "16px" : "20px",
                                    fontWeight: 500,
                                    lineHeight: "24px",
                                    textAlign: "center",
                                    color: "#052A63",
                                }}
                            >
                                Get Synced
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: "Lato",
                                    fontSize: isMobile ? "12px" : "14px",
                                    fontWeight: 400,
                                    lineHeight: "18px",
                                    textAlign: "center",
                                    color: "#434A51",
                                }}
                            >
                                Enable two-way client record updating
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                endIcon={<ArrowForwardWithCircle />}
                                sx={{
                                    width: "auto",
                                    height: "32px",
                                    borderRadius: "24px",
                                    alignSelf: "center",
                                    textTransform: "none",
                                    padding: "0 8px",
                                    background: "#4178FF",
                                }}
                            >
                                Send an Invite
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
MarketingBanner.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string.isRequired,
};

export default MarketingBanner;
