import { useState, useCallback } from "react";
import { Stack, Typography, Button, Divider } from "@mui/material";
import styles from "./CurrentCarrierSummaryBanner.module.scss";
import Media from "react-media";
import { Close } from "@integritymarketing/icons";

const LOGO_BASE_URL = "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PlanLogo/";

const CurrentCarrierSummaryBanner = ({ plans, plansCount, handleClear }) => {
    const [isMobile, setIsMobile] = useState(false);

    const getCarrierInfo = useCallback(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const carrierName = queryParams.get("carrierName");
        return plans.find(p => p.marketingName === carrierName);
    }, [plans])
    const carrierInfo = getCarrierInfo();

    return (
        <>
            <Media
                query={"(max-width: 560px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <Stack direction={isMobile ? "column" : "row"} className={styles.banner}>
                {!isMobile ? (
                    <>
                        <Stack direction="row" className={styles.summary}>
                            {carrierInfo?.logoURL &&
                                <img src={LOGO_BASE_URL + carrierInfo?.logoURL} className={styles.carrierLogo} />
                            }
                            <Typography variant="body1">
                                Showing <strong>{plansCount}</strong> plans from <strong>{carrierInfo?.marketingName}</strong>
                            </Typography>
                        </Stack>
                        <Button
                            color="primary"
                            size="small"
                            variant="text"
                            endIcon={<Close color="#4178FF" size="md" />}
                            onClick={() => handleClear()}
                        >
                            Clear Filter
                        </Button>
                    </>
                ) : (
                    <>
                        <div className={styles.topRowMobile}>
                            {carrierInfo?.logoURL &&
                                <img src={LOGO_BASE_URL + carrierInfo?.logoURL} className={styles.carrierLogo} />
                            }
                            <Button
                                color="primary"
                                size="small"
                                variant="text"
                                endIcon={<PreviewCollapse color="#4178FF" size="md" />}
                                onClick={() => handleClear()}
                            >
                                Clear Filter
                            </Button>
                        </div>
                        <Divider />
                        <div className={styles.bottomRowMobile}>
                            <Typography variant="body1">
                                Showing <strong>{plansCount}</strong> plans from <strong>{carrierInfo?.marketingName}</strong>
                            </Typography>
                        </div>
                    </>
                )}
            </Stack>
        </>
    )
}

export default CurrentCarrierSummaryBanner;