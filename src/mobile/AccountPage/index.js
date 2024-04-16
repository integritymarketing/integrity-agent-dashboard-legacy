import styles from "./styles.module.scss";

import Box from "@mui/material/Box";
import PropTypes from "prop-types";

const AccountMobile = ({ data }) => {
    const { firstName, lastName, phone, npn, email, caLicense } = data;

    return (
        <Box className={styles.details}>
            <Box className={styles.content}>
                <Box className={styles.title}>Full Name</Box>
                <Box className={styles.name}>
                    {firstName} {lastName}
                </Box>
            </Box>

            <Box className={styles.content}>
                <Box className={styles.title}>National Producer Number</Box>
                <Box className={styles.npn}>{npn}</Box>
            </Box>

            <Box className={styles.content}>
                <Box className={styles.title}>California License Number</Box>
                {caLicense && <Box className={styles.caLicense}>{caLicense}</Box>}
                {!caLicense && <Box className={styles.caLicenseEmpty}></Box>}
            </Box>

            <Box className={styles.content}>
                <Box className={styles.title}>Email</Box>
                <Box className={styles.email}>{email}</Box>
            </Box>

            <Box className={styles.content}>
                <Box className={styles.title}>Phone</Box>
                <Box className={styles.phone}>{phone}</Box>
            </Box>
        </Box>
    );
};

AccountMobile.propTypes = {
    data: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        phone: PropTypes.string,
        npn: PropTypes.string,
        email: PropTypes.string,
        caLicense: PropTypes.string,
    }),
};

export default AccountMobile;
