import { Box } from "@mui/material";
import styles from "./styles.module.scss";

const MobileActiveSA = ({ items }) => {
    return (
        <>
            <div className={styles.sectionContainer}>
                {items?.map((item, index) => {
                    const {
                        csgCarrierName,
                        productCategoryName,
                        agentWritingNumber
                    } = item;
                    return (
                        <div key={index} className={styles.column}>
                            <div className={styles.title}>Carrier:</div>
                            <div className={styles.spacing}>{csgCarrierName}</div>
                            <div className={styles.title}>Products:</div>
                            <div className={styles.pillWrapper}>
                                <Box className={styles.pill}>
                                    {productCategoryName}
                                </Box>
                            </div>
                            <div><div className={styles.title}>{`Producer ID: `}</div>{agentWritingNumber}</div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default MobileActiveSA;