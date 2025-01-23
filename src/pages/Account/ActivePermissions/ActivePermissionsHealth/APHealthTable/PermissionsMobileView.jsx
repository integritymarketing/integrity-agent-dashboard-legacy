import { Box } from "@mui/material";
import styles from "./styles.module.scss";
import { ActivePermissionFilter } from "../../ActivePermissionFilter";

const PermissionsMobileView = ({ items }) => {
    return (
        <>
            <ActivePermissionFilter />
            <div className={styles.sectionContainer}>
                {items?.map((item, index) => {
                    const {
                        carrier,
                        planYear,
                        producerId,
                        states,
                        planTypes } = item;
                    return (
                        <div key={index} className={styles.column}>
                            <div>
                                <div className={styles.title}>Carrier:</div>
                                <div>{carrier}</div>
                                <div className={styles.title}>States:</div>
                                <div >{states?.join(", ")}</div>
                                <div className={styles.title}>Products:</div>
                                <div className={styles.pillWrapper}>{planTypes?.map((planType) => (
                                    <Box className={styles.pill} key={planType}>
                                        {planType}
                                    </Box>
                                ))}</div>
                            </div>
                            <div className={styles.row}>
                                <div><span className={styles.title}>{`Year: `}</span>{planYear}</div>
                                <div><span className={styles.title}>{`ID: `}</span>{producerId}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default PermissionsMobileView;